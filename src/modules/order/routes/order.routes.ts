import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate";
import * as orderController from "../controller/order.controller";
import { CreateOrderSchema } from "../schema/order.schema";

const orderRouter = express.Router();

/**
 * POST /api/orders
 * Create a new order
 * Protected - requires authentication
 * Validates request body with CreateOrderSchema
 */
orderRouter.post(
  "/",
  authMiddleware,
  validate(CreateOrderSchema),
  orderController.createOrder
);

export default orderRouter;
