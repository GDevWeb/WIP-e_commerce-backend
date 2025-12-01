import { AppError } from "./AppError";

/**
 * Ressource not found
 * Status: 404 Not Found
 * Extends the AppError class.
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}
