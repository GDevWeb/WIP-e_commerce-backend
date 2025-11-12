import crypto from "crypto";
import { Request } from "express";

/**
 * Retrieves the session ID from the request cookies or generates a new one if not present.
 *
 * @param req - The Express request object.
 * @returns The session ID.
 */

export function getSessionId(req: Request): string {
  // Try retrieving from cookies
  let sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    // Generate an Id session
    sessionId = crypto.randomBytes(32).toString("hex");
  }

  return sessionId;
}
