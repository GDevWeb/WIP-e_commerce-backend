import { AppError } from "./AppError";

/**
 * Authentication requires or invalid
 * Status: 401 Unauthorized
 * Extends the AppError class.
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401);
  }
}
