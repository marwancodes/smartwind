import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { createClerkClient } from "@clerk/backend";
import { getEnv } from "./env.js";
import { parseRole } from "./roles.js";

export async function getLocalUser(clerkUserId: string) {
  const [row] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1);
  if (row) return row;

  // User authenticated with Clerk but the webhook hasn't synced them yet — fetch and upsert now.
  const env = getEnv();
  const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
  const clerkUser = await clerk.users.getUser(clerkUserId);

  const email =
    clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ??
    clerkUser.emailAddresses?.[0]?.emailAddress ??
    "";

  const displayName =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    null;

  const role = parseRole(clerkUser.publicMetadata?.role);

  const [upserted] = await db
    .insert(users)
    .values({ clerkUserId, email, displayName, role })
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: { email, displayName, role, updatedAt: new Date() },
    })
    .returning();

  return upserted;
}