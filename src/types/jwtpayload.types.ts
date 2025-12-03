/*
 * JWT Payload Type Definition
 * This file defines the structure of the payload contained within a JSON Web Token (JWT).
 * It is used to ensure type safety when decoding JWTs in the application.
 */

export interface jwtPayload {
  userId: number;
  email?: string;
}
