import type { Request, Response } from "express";
import { getEnv } from "../lib/env.js";
import { Webhook } from "standardwebhooks";
import {
  alreadyPaid,
  findSessionByPolarCheckoutId,
  fulfillCheckoutSession,
} from "../lib/fulfillment.js";

function headerString(headers: Request["headers"], name: string) {
  const value = headers[name];
  return Array.isArray(value) ? value[0] : value;
}

function checkoutSessionIdFromMetadata(order: Record<string, unknown>) {
  const metadata = order.metadata;
  if (!metadata || typeof metadata !== "object") return undefined;
  const sessionId = (metadata as Record<string, unknown>).checkout_session_id;
  return typeof sessionId === "string" ? sessionId : undefined;
}

export async function polarWebhookHandler(req: Request, res: Response) {
  const env = getEnv();

  console.log("[polar webhook] received request");

  try {
    if (!env.POLAR_WEBHOOK_SECRET) {
      console.error("[polar webhook] POLAR_WEBHOOK_SECRET not configured");
      res.status(503).send("Polar webhooks not configured");
      return;
    }

    const raw = req.body instanceof Buffer ? req.body : Buffer.from(String(req.body));
    const wh = new Webhook(Buffer.from(env.POLAR_WEBHOOK_SECRET, "utf8").toString("base64"));

    const id = headerString(req.headers, "webhook-id");
    const ts = headerString(req.headers, "webhook-timestamp");
    const sig = headerString(req.headers, "webhook-signature");

    if (!id || !ts || !sig) {
      res.status(400).json({ error: "Missing webhook headers" });
      return;
    }

    wh.verify(raw, { "webhook-id": id, "webhook-timestamp": ts, "webhook-signature": sig });

    const event = JSON.parse(raw.toString("utf8")) as {
      type: string;
      data?: Record<string, unknown>;
    };

    console.log(`[polar webhook] verified event: ${event.type}`);

    if (event.type === "order.paid" && event.data) {
      const data = event.data;
      const polarOrderId = typeof data.id === "string" ? data.id : undefined;
      const checkoutId = typeof data.checkout_id === "string" ? data.checkout_id : undefined;

      if (await alreadyPaid(polarOrderId, checkoutId)) {
        console.log("[polar webhook] order already paid, skipping", { polarOrderId, checkoutId });
        res.json({ ok: true, duplicate: true });
        return;
      }

      let sessionId = checkoutSessionIdFromMetadata(data);

      if (!sessionId && checkoutId) {
        sessionId = await findSessionByPolarCheckoutId(checkoutId);
      }

      console.log("[polar webhook] resolving session", { sessionId, checkoutId, polarOrderId });

      if (sessionId) {
        const ok = await fulfillCheckoutSession(sessionId, polarOrderId, checkoutId);

        if (ok) {
          console.log("[polar webhook] order fulfilled", { sessionId, polarOrderId });
          res.json({ ok: true });
          return;
        }

        if (await alreadyPaid(polarOrderId, checkoutId)) {
          res.json({ ok: true, duplicate: true });
          return;
        }

        console.error("Polar order.paid: could not fulfill checkout session", {
          sessionId,
          checkoutId,
        });

        res.status(500).json({ error: "Checkout fulfillment failed" });
        return;
      }

      console.error("[polar webhook] order.paid but no matching checkout session", {
        checkoutId,
        polarOrderId,
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Polar webhook error", err);
    res.status(400).json({ error: "Invalid webhook" });
  }
}