import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

// TTL cart
const cart_TTL = parseInt(process.env.CART_TTL || "604800");

// Helper - Generate key for Redis cart
function getCartKey(userId?: number, sessionId?: string): string {
  if (userId) {
    return `cart:user:${userId}`;
  }
  if (sessionId) {
    return `cart:session:${sessionId}`;
  }
  throw new Error("userId or sessionId required");
}
