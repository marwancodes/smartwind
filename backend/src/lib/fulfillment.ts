import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { checkoutSessions, orderItems, orders } from "../db/schema.js";

export async function findSessionByPolarCheckoutId(polarCheckoutId: string) {
  const [session] = await db
    .select()
    .from(checkoutSessions)
    .where(eq(checkoutSessions.polarCheckoutId, polarCheckoutId))
    .limit(1);
  return session?.id;
}

export async function alreadyPaid(polarOrderId?: string, checkoutId?: string) {
  if (polarOrderId) {
    const [row] = await db
      .select()
      .from(orders)
      .where(eq(orders.polarOrderId, polarOrderId))
      .limit(1);
    if (row?.status === "paid") return row;
  }
  if (checkoutId) {
    const [row] = await db
      .select()
      .from(orders)
      .where(eq(orders.polarCheckoutId, checkoutId))
      .limit(1);
    if (row?.status === "paid") return row;
  }
  return undefined;
}

/**
 * Creates a paid order (and its line items) from a checkout session.
 *
 * Exactly-once guarantee: we DELETE the checkout session with RETURNING as the
 * atomic claim. A given session row can only be deleted by one transaction, so
 * concurrent callers (Polar webhook + the /checkout/return confirmation) can
 * never both create an order for the same session. If the delete returns no
 * row, someone else already fulfilled it and we return undefined.
 *
 * Returns the created order id, or undefined if the session was already claimed.
 */
export async function fulfillCheckoutSession(
  sessionId: string,
  polarOrderId: string | undefined,
  checkoutId: string | undefined,
) {
  return await db.transaction(async (tx) => {
    const [session] = await tx
      .delete(checkoutSessions)
      .where(eq(checkoutSessions.id, sessionId))
      .returning();

    if (!session) return undefined;

    const [order] = await tx
      .insert(orders)
      .values({
        userId: session.userId,
        status: "paid",
        totalCents: session.totalCents,
        polarCheckoutId: checkoutId ?? session.polarCheckoutId ?? null,
        ...(polarOrderId ? { polarOrderId } : {}),
      })
      .returning();

    if (session.lines.length) {
      await tx.insert(orderItems).values(
        session.lines.map((line) => ({
          orderId: order.id,
          productId: line.productId,
          quantity: line.quantity,
          unitPriceCents: line.unitPriceCents,
        })),
      );
    }

    return order.id;
  });
}
