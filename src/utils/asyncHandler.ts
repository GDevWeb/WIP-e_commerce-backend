import { NextFunction, Request, Response } from "express";

/**
 * A higher-order function that wraps asynchronous request handlers to catch
 * any errors and pass them to the Express error handling middleware.
 * This avoids the need for repetitive try-catch blocks in every async controller.
 *
 * @param fn - The asynchronous request handler function (req, res, next).
 * @returns A new request handler function that executes the original handler
 *          and catches any promise rejections, passing them to `next()`.
 */
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
