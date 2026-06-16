import type { Request, Response, NextFunction } from "express";
import { getEnv } from "../lib/env";
import z from "zod";
import { getAuth } from "@clerk/express";
import { getLocalUser } from "../lib/users";
import { db } from "../db";
import { CheckoutSessionLine, checkoutSessions, products } from "../db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { polarCreateCheckout, polarGetCheckout } from "../lib/polar";
import {
  alreadyPaid,
  findSessionByPolarCheckoutId,
  fulfillCheckoutSession,
} from "../lib/fulfillment";

const PAID_CHECKOUT_STATUSES = new Set(["succeeded", "confirmed"]);

const env = getEnv();

const cartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function createCheckout(req: Request, res: Response, next: NextFunction) {
  try {
    // only signed-in users can start checkout
    const { userId, isAuthenticated } = getAuth(req);
    if (!isAuthenticated || !userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsed = cartSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid cart", details: parsed.error.flatten() });
      return;
    }

    // polar access token is required
    if (!env.POLAR_ACCESS_TOKEN) {
      res.status(503).json({ error: "Payments are not configured" });
      return;
    }

    const localUser = await getLocalUser(userId);
    if (!localUser) {
      res.status(503).json({ error: "Account not synced yet" });
      return;
    }

    const ids = parsed.data.items.map((i) => i.productId);

    // load every cart product that exists, is active, and matches the IDs we asked for.
    const prodRows = await db
      .select()
      .from(products)
      .where(and(inArray(products.id, ids), eq(products.active, true)));

    if (prodRows.length !== ids.length) {
      res.status(400).json({ error: "One or more products are invalid" });
      return;
    }

    const byId = new Map(prodRows.map((p) => [p.id, p]));
    let totalCents = 0;
    const lines: CheckoutSessionLine[] = [];

    for (const line of parsed.data.items) {
      const p = byId.get(line.productId)!;
      totalCents += p.priceCents * line.quantity;
      lines.push({
        productId: p.id,
        quantity: line.quantity,
        unitPriceCents: p.priceCents,
      });
    }

    if (totalCents < 10) {
      res.status(400).json({
        error: "Total below Polar minimum (e.g. GBP requires at least 10 cents)",
      });
      return;
    }

    const [session] = await db
      .insert(checkoutSessions)
      .values({
        userId: localUser.id,
        lines,
        totalCents,
        currency: "gbp",
      })
      .returning();

    const successUrl = `${env.FRONTEND_URL}/checkout/return?checkout_id={CHECKOUT_ID}`;
    const returnUrl = `${env.FRONTEND_URL}/cart`;

    const checkout = await polarCreateCheckout(env, {
      products: [env.POLAR_CHECKOUT_PRODUCT_ID],
      prices: {
        [env.POLAR_CHECKOUT_PRODUCT_ID]: [
          {
            amount_type: "fixed",
            price_currency: "gbp",
            price_amount: totalCents,
          },
        ],
      },

      success_url: successUrl,
      return_url: returnUrl,
      external_customer_id: userId,
      metadata: { checkout_session_id: session.id },
    });

    await db
      .update(checkoutSessions)
      .set({ polarCheckoutId: checkout.id })
      .where(eq(checkoutSessions.id, session.id));

    res.json({ checkoutUrl: checkout.url });
  } catch (e) {
    next(e);
  }
}

const confirmSchema = z.object({
  checkoutId: z.string().min(1),
});

/**
 * Fallback fulfillment for the /checkout/return page. The Polar webhook is the
 * primary path, but it can't reach a local dev server without a live tunnel, so
 * this verifies the payment directly with Polar and fulfills the session.
 * Idempotent: if the webhook already created the order, we just return it.
 */
export async function confirmCheckout(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, isAuthenticated } = getAuth(req);
    if (!isAuthenticated || !userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const parsed = confirmSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request", details: parsed.error.flatten() });
      return;
    }

    if (!env.POLAR_ACCESS_TOKEN) {
      res.status(503).json({ error: "Payments are not configured" });
      return;
    }

    const checkoutId = parsed.data.checkoutId;

    const existing = await alreadyPaid(undefined, checkoutId);
    if (existing) {
      res.json({ status: "paid", orderId: existing.id });
      return;
    }

    const checkout = await polarGetCheckout(env, checkoutId);

    if (!PAID_CHECKOUT_STATUSES.has(checkout.status)) {
      res.json({ status: "pending" });
      return;
    }

    const sessionId = await findSessionByPolarCheckoutId(checkoutId);
    if (!sessionId) {
      // Either never created, or already fulfilled (session deleted) by the webhook.
      const paid = await alreadyPaid(checkout.order_id ?? undefined, checkoutId);
      if (paid) {
        res.json({ status: "paid", orderId: paid.id });
        return;
      }
      res.status(404).json({ error: "Checkout session not found" });
      return;
    }

    const orderId = await fulfillCheckoutSession(
      sessionId,
      checkout.order_id ?? undefined,
      checkoutId,
    );

    if (orderId) {
      res.json({ status: "paid", orderId });
      return;
    }

    const paid = await alreadyPaid(checkout.order_id ?? undefined, checkoutId);
    if (paid) {
      res.json({ status: "paid", orderId: paid.id });
      return;
    }

    res.status(500).json({ error: "Checkout fulfillment failed" });
  } catch (e) {
    next(e);
  }
}