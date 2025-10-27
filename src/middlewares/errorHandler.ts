import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors";
import { Prisma } from "../generated/prisma";
import logger from "../utils/logger";

/**
 * Global Error Handler Middleware.
 * This middleware should be the LAST one added to the Express app.
 */
export const errorHandler = (
  receivedError: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = receivedError as any;

  logger.error("❌ Error caught by global handler:", {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });

  const isOperationalError =
    error.isOperational === true || error instanceof AppError;

  if (isOperationalError) {
    const statusCode = error.statusCode || 500;
    const message = error.message;

    res.status(statusCode).json({
      status: "error",
      message: message,
    });
    return;
  }
  // 2. Handle Zod errors
  if (error instanceof ZodError) {
    const formattedErrors = error.issues.map((issue) => ({
      field: issue.path.slice(1).join("."),
      message: issue.message,
    }));

    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: formattedErrors,
    });
    return;
  }

  // 3. Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 - Unique constraint
    if (error.code === "P2002") {
      const target = (error.meta?.target as string[]) || [];
      res.status(409).json({
        status: "error",
        message: `A record with this ${target.join(", ")} already exists`,
      });
      return;
    }

    // P2025 - Record not found
    if (error.code === "P2025") {
      res.status(404).json({
        status: "error",
        message: "Record not found",
      });
      return;
    }

    // P2003 - Foreign key constraint
    if (error.code === "P2003") {
      res.status(400).json({
        status: "error",
        message: "Invalid relation or foreign key constraint",
      });
      return;
    }
  }

  // 4. Unknown Errors = 500
  res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};
