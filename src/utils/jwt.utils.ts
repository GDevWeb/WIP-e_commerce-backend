import dotenv from "dotenv";
import jwt, { SignOptions } from "jsonwebtoken";
import { UnauthorizedError } from "../errors";

dotenv.config();

/**
 * Generate JWT Access Token
 * @param userId - User ID
 * @param email - User email
 * @returns Access token (short-lived)
 */
export const generateAccessToken = (userId: number, email: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return jwt.sign({ userId, email }, secret, { expiresIn } as SignOptions);
};

/**
 * Generate JWT Refresh Token
 * @param userId - User ID
 * @returns Refresh token (long-lived)
 */
export const generateRefreshToken = (userId: number): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "30d";

  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined in .env");
  }

  return jwt.sign({ userId }, secret, { expiresIn } as SignOptions);
};

/**
 * Verify JWT Token
 * @param token - JWT token to verify
 * @param isRefresh - Whether it's a refresh token
 * @returns Decoded payload
 */
export const verifyToken = (
  token: string,
  isRefresh: boolean = false
): { userId: number; email?: string } => {
  const secret = isRefresh
    ? process.env.JWT_REFRESH_SECRET
    : process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT secret is not defined");
  }

  try {
    const decoded = jwt.verify(token, secret) as {
      userId: number;
      email?: string;
    };
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Refresh token has expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError(
        "Invalid refresh token signature or malformed token"
      );
    }
    throw error;
  }
};
