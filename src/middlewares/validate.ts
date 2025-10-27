import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

/**
 * Middleware to validate request body, params, and query against a Zod schema.
 * @param schema - The Zod schema to validate against.
 * @returns An Express middleware function.
 */
export const validate = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body || {},
        params: req.params || {},
        query: req.query || {},
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.slice(1).join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: formattedErrors,
        });
      }

      next(error);
    }
  };
};
