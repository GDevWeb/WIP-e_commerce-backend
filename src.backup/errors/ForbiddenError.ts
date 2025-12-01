import { AppError } from "./AppError";

/**
 * Forbidden access (insuffisant privileges)
 * Status: 403 Forbidden
 * Extends the AppError class.
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden") {
    super(message, 403);
  }
}
