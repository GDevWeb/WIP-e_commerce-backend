import express, { Express } from "express";
import { errorHandler } from "../../middlewares/errorHandler";
import authRouter from "../../modules/auth/routes/auth.routes";
import customerRouter from "../../modules/customer/routes/customer.routes";
import productRouter from "../../modules/product/routes/product.routes";

/**
 * Create Express app for testing
 * WITHOUT connecting to real database or Redis
 */
export const createTestApp = (): Express => {
  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use("/api/products", productRouter);
  app.use("/api/customers", customerRouter);
  app.use("/api/auth", authRouter);

  // Error handler
  app.use(errorHandler);

  return app;
};
