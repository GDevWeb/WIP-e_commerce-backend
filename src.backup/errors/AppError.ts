/**
 * AppError class for handling operational errors in the application.
 * Extends the built-in Error class.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture the stack trace for better debugging
    Error.captureStackTrace(this, this.constructor);

    // Define the class name
    this.name = this.constructor.name;
  }
}
