import { NextFunction, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/auth.types";
import { verifyToken } from "../utils/jwt.utils";

const prisma = new PrismaClient();

/**
 * Optional authentication middleware.
 * This middleware attempts to authenticate a user based on a Bearer token in the Authorization header.
 * If a valid token is found, the user's information (userId, email) is attached to `req.user`.
 * If no token is present, the token is invalid, or the user is not found, the request proceeds
 * without `req.user` being set, allowing anonymous access to routes.
 *
 * @param req - The Express request object, extended with an optional `user` property.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 * @returns A Promise that resolves when the middleware has completed its execution.
 */

export const optionalAuthMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const header = req.headers.authorization;

    // Check for session ID in cookies if no Authorization header
    if (!header || !header.startsWith("Bearer ")) {
      return next();
    }

    const token = header.split(" ")[1];

    // If no token, continue without user
    if (!token) {
      return next();
    }

    // Try checking token
    try {
      const decoded = verifyToken(token);
      const { userId, email } = decoded;

      // check if user exists
      const user = await prisma.customer.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
      });

      // If no header, continue without user (anonymous)
      // If there's a sessionId but no Bearer token, proceed as anonymous
      // The cart service will handle the sessionId
      if (!header && req.cookies?.sessionId) {
        return next();
      }

      if (user) {
        req.user = {
          userId: user.id,
          email: user.email,
        };
      }

      // Continue even if user not found
      next();
    } catch (error) {
      // If there's a sessionId and an invalid/expired token, proceed as anonymous
      if (req.cookies?.sessionId) {
        return next();
      }

      next();
    }
  } catch (error) {
    // If there's a sessionId, proceed as anonymous
    if (req.cookies?.sessionId) {
      return next();
    }

    next();
  }
};
