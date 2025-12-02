import { ConflictError, NotFoundError } from "../index";

/**
 * This file is for testing the custom error classes.
 * It demonstrates how to throw and catch instances of NotFoundError and ConflictError.
 */
try {
  throw new NotFoundError("Customer not found");
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log("Status:", error.statusCode); // 404
    console.log("Message:", error.message); // "Customer not found"
    console.log("Operational:", error.isOperational); // true
  }
}

try {
  throw new ConflictError("Email already exists");
} catch (error) {
  if (error instanceof ConflictError) {
    console.log("Status:", error.statusCode); // 409
    console.log("Message:", error.message);
  }
}

console.log("✅ All custom errors working!");
