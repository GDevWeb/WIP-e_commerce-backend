import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { PrismaClient } from "./generated/prisma";
import { errorHandler } from "./middlewares/errorHandler";
import { configureSecurityMiddlewares } from "./middlewares/security";
import orderRouter from "./modules/order/routes/order.routes";
import authRouter from "./routes/auth.routes";
import brandRouter from "./routes/brand.routes";
import categoryRouter from "./routes/category.routes";
import customerRouter from "./routes/customer.routes";
import orderItemRouter from "./routes/orderItem.routes";
import productRouter from "./routes/product.routes";
import reviewRouter from "./routes/review.routes";
import logger from "./utils/logger";

dotenv.config();

const server = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// helmet
configureSecurityMiddlewares(server);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

server.use("/api/categories", categoryRouter);
server.use("/api/brands", brandRouter);
server.use("/api/products", productRouter);
server.use("/api/customers", customerRouter);
server.use("/api/orders", orderRouter);
server.use("/api/orderItems", orderItemRouter);
server.use("/api/reviews", reviewRouter);
server.use("/api/auth", authRouter);

server.get("/", (req: Request, res: Response) => {
  res.status(200).send("e_commerce API is running");
});

server.use(errorHandler);

async function main() {
  try {
    await prisma.$connect();
    console.log(`Successfully connected to the database`);

    server.listen(PORT, () => {
      logger.info(`Server is listening on: "http://localhost:${PORT}"`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
}

main();
