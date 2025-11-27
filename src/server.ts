import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { connectRedis, disconnectRedis } from "./configuration/redis";
import {
  configureSanitization,
  corsOptions,
  devCorsOptions,
  generalLimiter,
} from "./configuration/security.config";
import { PrismaClient } from "./generated/prisma";
import { errorHandler } from "./middlewares/errorHandler";
import { configureSecurityMiddlewares } from "./middlewares/security";
import authRouter from "./modules/auth/routes/auth.routes";
import brandRouter from "./modules/brand/routes/brand.routes";
import cartRouter from "./modules/cart/routes/cart.routes";
import categoryRouter from "./modules/category/routes/category.routes";
import customerRouter from "./modules/customer/routes/customer.routes";
import orderRouter from "./modules/order/routes/order.routes";
import productRouter from "./modules/product/routes/product.routes";
import reviewRouter from "./modules/review/routes/review.routes";
import orderItemRouter from "./routes/orderItem.routes";
import { ensureUploadDirs } from "./services/upload.service";
import logger from "./utils/logger";

dotenv.config();

const server = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Security middlewares
configureSecurityMiddlewares(server);

// Body parsers
server.use(express.json({ limit: "10mb" }));
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

// Input sanitization
configureSanitization(server);

// CORS middleware
const isDevelopment = process.env.NODE_ENV === "development";
server.use(cors(isDevelopment ? devCorsOptions : corsOptions));
// Rate limiting middleware
server.use("/api/", generalLimiter);
// Static files (uploads)
const UPLOADS_PATH = path.join(process.cwd(), "uploads");
server.use("/uploads", express.static(UPLOADS_PATH));
// API routes
server.use("/api/categories", categoryRouter);
server.use("/api/brands", brandRouter);
server.use("/api/products", productRouter);
server.use("/api/customers", customerRouter);
server.use("/api/orders", orderRouter);
server.use("/api/orderItems", orderItemRouter);
server.use("/api/reviews", reviewRouter);
server.use("/api/auth", authRouter);
server.use("/api/cart", cartRouter);

// Health check endpoint
server.get("/", (req: Request, res: Response) => {
  res.status(200).send("e_commerce API is running");
});

// Error handling middleware
server.use(errorHandler);

// Start the server
async function startServer() {
  try {
    await prisma.$connect();
    logger.info(`\n🖲️ Successfully connected to the database`);

    await ensureUploadDirs();
    await connectRedis();

    server.listen(PORT, () => {
      logger.info(`🌍 Server is listening on: "http://localhost:${PORT}"`);
    });
  } catch (error) {
    logger.error("❌ Failed to connect to the database", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("\n🔴 Shutting down gracefully...");
  await disconnectRedis();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("\n🔴 Shutting down gracefully...");
  await disconnectRedis();
  process.exit(0);
});

startServer();
