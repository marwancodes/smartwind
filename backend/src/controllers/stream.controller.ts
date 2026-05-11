import type { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { getLocalUser } from "../lib/users.js";
import { getStreamChatServer, streamChatDisplayName, streamUserId } from "../lib/stream.js";
import { getEnv } from "../lib/env.js";

const env = getEnv();

export async function createStreamToken(req: Request, res: Response, next: NextFunction) {
  try {

    //****** Check if user is authenticated with Clerk or not
    const { userId, isAuthenticated } = getAuth(req);
    if (!isAuthenticated || !userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    //****** Check if the authenticated user already has a local account in our database. This is important because we need to know the user's role (admin, support, or regular user) to determine how they should appear in the Stream Chat. If the user doesn't have a local account yet, we return a 503 error indicating that their account is not synced yet. This can happen if the user just signed up and the background job that syncs Clerk users to our local database hasn't run yet.
    const localUser = await getLocalUser(userId);
    if (!localUser) {
      res.status(503).json({ error: "Account not synced yet" });
      return;
    }

    const server = getStreamChatServer(env);

    const clerkUser = await clerkClient.users.getUser(userId);

    const combined = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;

    const name = streamChatDisplayName(
      localUser.role,
      localUser.displayName ?? combined ?? clerkUser.username,
      localUser.email,
    );

    const image = clerkUser.imageUrl || undefined;
    const sid = streamUserId(userId);

    await server.upsertUser({ id: sid, name, image });

    const token = server.createToken(sid);

    res.json({ token, apiKey: env.STREAM_API_KEY, userId: sid, name });
  } catch (e) {
    next(e);
  }
}