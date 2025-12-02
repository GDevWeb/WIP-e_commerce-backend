import { AppError } from "./AppError";

/**
 * Resource conflict (eg: email already exists)
 * Status: 409 Conflict
 * Extends the AppError class.
 */
export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, 409);
  }
}
