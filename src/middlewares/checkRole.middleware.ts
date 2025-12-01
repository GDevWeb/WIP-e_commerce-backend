import { NextFunction, Response } from "express";
import { ForbiddenError } from "../errors";
import { PrismaClient, Role } from "@prisma/client";
import { AuthRequest } from "../types/auth.types";

const prisma = new PrismaClient();

/**
 * Middleware to check if the authenticated user has one of the allowed roles.
 *
 * @param allowedRole - An array of `Role` enums that are permitted to access the route.
 * @returns An Express middleware function.
 */
export const checkRole = (allowedRole: Role[]) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // 1.Checking if user is authenticated
      if (!req.user?.userId) {
        throw new ForbiddenError("Authentication required");
      }

      // 2.Retrieving the user with his role
      const user = await prisma.customer.findUnique({
        where: { id: req.user.userId },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new ForbiddenError("User not found");
      }

      // 3.Checking allowed Role
      if (!allowedRole.includes(user.role)) {
        throw new ForbiddenError(
          `Access denied. Required Role: ${allowedRole.join(" or ")}`
        );
      }
      // 4.Link
      req.user.role = user.role;
      next();
    } catch (error) {
      next(error);
    }
  };
};

//created 2025-11-20
