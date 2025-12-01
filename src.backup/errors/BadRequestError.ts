import { AppError } from "./AppError";

/**
 * Requête invalide (format, paramètres, etc.)
 * Status: 400 Bad Request
 * Extends the AppError class.
 */
export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, 400);
  }
}
