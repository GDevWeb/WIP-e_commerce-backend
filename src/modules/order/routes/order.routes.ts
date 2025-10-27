import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate";
import * as orderController from "../controller/order.controller";
import {
  CreateOrderSchema,
  GetOrderByIdSchema,
  GetOrdersSchema,
  UpdateOrderStatusSchema,
} from "../schema/order.schema";

const orderRouter = express.Router();

/**
 * POST /api/orders
 * Create a new order
 */
orderRouter.post(
  "/",
  authMiddleware,
  validate(CreateOrderSchema),
  orderController.createOrder
);

/**
 * GET /api/orders
 * Get all orders for authenticated user
 * Query params: ?status=PENDING&page=1&limit=20
 */
orderRouter.get(
  "/",
  authMiddleware,
  validate(GetOrdersSchema),
  orderController.getOrders
);

/**
 * GET /api/orders/:id
 * Get a single order by ID
 */
orderRouter.get(
  "/:id",
  authMiddleware,
  validate(GetOrderByIdSchema),
  orderController.getOrderById
);

/**
 * PATCH /api/orders/:id/status
 * Update order status
 * TODO: Restrict to ADMIN role in Phase 3
 */
orderRouter.patch(
  "/:id/status",
  authMiddleware,
  validate(UpdateOrderStatusSchema),
  orderController.updateOrderStatus
);

export default orderRouter;
