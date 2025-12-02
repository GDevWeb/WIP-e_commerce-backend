import bcrypt from "bcrypt";
import dotenv from "dotenv";
import ms from "ms";
import { config } from "../../../configuration/env.config";
import { UnauthorizedError } from "../../../errors";
import { PrismaClient } from "@prisma/client";
import { UserProfile } from "../../../types/user.types";
import { handlePrismaError } from "../../../utils/handlePrismaError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../../utils/jwt.utils";
import {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "../schema/auth.schema";
import { AuthResponse } from "../types/authResponse.types";

dotenv.config();

const prisma = new PrismaClient();

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  try {
    const hashedPassword = await bcrypt.hash(
      input.password,
      config.bcrypt.rounds
    );

    const newUser = await prisma.customer.create({
      data: {
        email: input.email,
        password: hashedPassword,
        first_name: input.first_name,
        last_name: input.last_name,
      },
    });

    const accessToken = generateAccessToken(newUser.id, newUser.email);
    const refreshToken = generateRefreshToken(newUser.id);

    // Storing refresh token in DB
    await saveRefreshToken(newUser.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
      },
    };
  } catch (error) {
    handlePrismaError(error);
  }
  throw new Error("Failed to register user");
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await prisma.customer.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  if (!user.password) {
    throw new UnauthorizedError("Account has no password set");
  }

  const isValidPassword = await bcrypt.compare(
    input.password,
    user.password as string
  );

  if (!isValidPassword) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id, user.email);
  const refreshToken = generateRefreshToken(user.id);

  // Optional but important fro security Deleting the older tokens
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
  // Limiting the number of active sessions
  await saveRefreshToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    },
  };
};

export const getProfile = async (userId: number): Promise<UserProfile> => {
  const user = await prisma.customer.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      phone_number: true,
      address: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  return user;
};

export const updateProfile = async (
  userId: number,
  data: UpdateProfileInput
): Promise<UserProfile> => {
  const user = await prisma.customer.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  const updatedUser = await prisma.customer.update({
    where: { id: userId },
    data: data,
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      phone_number: true,
      address: true,
    },
  });

  return updatedUser;
};

export const saveRefreshToken = async (
  userId: number,
  token: string
): Promise<void> => {
  const jwtRefreshExpiresIn = config.jwt.refreshExpiresIn || "30d";
  console.info("jwtRefreshExpiresIn:", jwtRefreshExpiresIn);

  const milliseconds = ms(jwtRefreshExpiresIn as ms.StringValue);
  const expiresAt = new Date(Date.now() + milliseconds);

  console.info("Saving refresh token, expires at:", expiresAt);

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};

export const refreshTokenAccess = async (
  refreshToken: string
): Promise<{ accessToken: string; refreshToken?: string }> => {
  try {
    const decoded = verifyToken(refreshToken, true);

    const existingRefreshToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!existingRefreshToken) {
      console.error("❌ Token not found in database");
      throw new UnauthorizedError("Refresh token already used or revoked");
    }

    const storedToken = existingRefreshToken.expiresAt;
    const today = new Date();

    console.log("🔍 Token expiration check:", {
      expiresAt: storedToken,
      now: today,
      isExpired: storedToken.getTime() < today.getTime(),
    });

    if (storedToken.getTime() < today.getTime()) {
      console.error("❌ Token expired (Database)");
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
      throw new UnauthorizedError("Refresh token expired (DB-check)");
    }

    const existingUser = await prisma.customer.findUnique({
      where: { id: decoded.userId },
    });

    if (!existingUser) {
      console.error("❌ User not found:", decoded.userId);
      throw new UnauthorizedError("User linked to refresh token not found");
    }

    const newAccessToken = generateAccessToken(
      existingUser.id,
      existingUser.email
    );
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    const newRefreshToken = generateRefreshToken(existingUser.id);
    await saveRefreshToken(existingUser.id, newRefreshToken);

    console.log("✅ Token refresh successful for user:", existingUser.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    console.error("❌ refreshTokenAccess error:", error);

    if ((error as any).isOperational === true) {
      throw error;
    }
    throw new UnauthorizedError("Invalid refresh token (unforeseen issue)");
  }
};
