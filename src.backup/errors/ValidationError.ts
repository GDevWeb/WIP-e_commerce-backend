import { AppError } from "./AppError";

/**
 * ValidationError class for handling validation errors.
 * Extends the AppError class.
 */
export class ValidationError extends AppError {
  constructor(message: string = "Validation failed") {
    super(message, 400);
  }
}
