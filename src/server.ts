import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { connectRedis, disconnectRedis } from "./configuration/redis";
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
import logger from "./utils/logger";
import cookieParser = require("cookie-parser");

dotenv.config();

const server = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// helmet
configureSecurityMiddlewares(server);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

server.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

server.use("/api/categories", categoryRouter);
server.use("/api/brands", brandRouter);
server.use("/api/products", productRouter);
server.use("/api/customers", customerRouter);
server.use("/api/orders", orderRouter);
server.use("/api/orderItems", orderItemRouter);
server.use("/api/reviews", reviewRouter);
server.use("/api/auth", authRouter);
server.use("/api/cart", cartRouter);

server.get("/", (req: Request, res: Response) => {
  res.status(200).send("e_commerce API is running");
});

server.use(errorHandler);

async function startServer() {
  try {
    // 1.Prisma
    await prisma.$connect();
    logger.info(`\n🖲️ Successfully connected to the database`);

    // 2.Redis
    await connectRedis();
    // 3.API
    server.listen(PORT, () => {
      logger.info(`🌍 Server is listening on: "http://localhost:${PORT}"`);
    });
  } catch (error) {
    logger.error("❌ Failed to connect to the database", error);
    process.exit(1);
  }
}

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
