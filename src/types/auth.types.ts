import { Request } from "express";
import { Role } from "@prisma/client";

/**
 * Extends the Express Request interface to include an optional `user` property.
 * This `user` property is populated by authentication middleware and contains
 * the authenticated user's ID, email, and optionally their role.
 */
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role?: Role; //updated 2025-11-20
  };
}
