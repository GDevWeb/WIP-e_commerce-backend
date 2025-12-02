import { NextFunction, Response } from "express";
import { UnauthorizedError } from "../errors";
import { PrismaClient } from "../generated/prisma";
import { AuthRequest } from "../types/auth.types";
import { verifyToken } from "../utils/jwt.utils";

const prisma = new PrismaClient();

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1.header
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authentication required");
    }

    // 2.token
    const token = header.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Token missing");
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err: any) {
      if (err.message === "Token has expired") {
        throw new UnauthorizedError("Token expired");
      }
      throw new UnauthorizedError("Invalid token");
    }

    // 3.decoded token
    const { userId, email } = decoded;

    const user = await prisma.customer.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    req.user = {
      userId: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};
