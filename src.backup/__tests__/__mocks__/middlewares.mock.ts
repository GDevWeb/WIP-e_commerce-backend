import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../types/auth.types";

/**
 * Mock authenticated user for tests
 */
export const mockAuthUser = {
  userId: 1,
  email: "user@test.com",
  role: "USER" as const,
};

export const mockAuthAdmin = {
  userId: 2,
  email: "admin@test.com",
  role: "ADMIN" as const,
};

export const mockAuthManager = {
  userId: 3,
  email: "manager@test.com",
  role: "MANAGER" as const,
};

/**
 * Mock authMiddleware - injects user into req
 */
export const mockAuthMiddleware = (user = mockAuthUser) => {
  return (req: Request, res: Response, next: NextFunction) => {
    (req as AuthRequest).user = user;
    next();
  };
};

/**
 * Mock unauthorized (no token)
 */
export const mockAuthMiddlewareUnauthorized = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.status(401).json({
      status: "error",
      message: "No token provided",
    });
  };
};

/**
 * Mock checkRole middleware
 */
export const mockCheckRoleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    if (allowedRoles.includes(user.role as string)) {
      next();
    } else {
      res.status(403).json({
        status: "error",
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      });
    }
  };
};

/**
 * Mock validation middleware - passes all validations
 */
export const mockValidateMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    next();
  };
};

/**
 * Mock validation error
 */
export const mockValidateMiddlewareError = (errors: any[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors,
    });
  };
};
