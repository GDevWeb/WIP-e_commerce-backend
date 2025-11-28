import express from "express";
import { Role } from "../../../generated/prisma";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { checkRole } from "../../../middlewares/checkRole.middleware";
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
 */
orderRouter.patch(
  "/:id/status",
  checkRole([Role.ADMIN, Role.MANAGER]),
  authMiddleware,
  validate(UpdateOrderStatusSchema),
  orderController.updateOrderStatus
);

/**
 * GET /api/orders/admin/all
 * Get all orders - ADMIN/MANAGER ONLY
 */
orderRouter.get(
  "/admin/all",
  authMiddleware,
  checkRole([Role.ADMIN, Role.MANAGER]),
  orderController.getAllOrders
);

/**
 * GET /api/orders/admin/stats
 * Get order statistics - ADMIN/MANAGER ONLY
 */
orderRouter.get(
  "/admin/stats",
  authMiddleware,
  checkRole([Role.ADMIN, Role.MANAGER]),
  orderController.getOrderStats
);

// Swagger Zone

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get user orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved
 *   post:
 *     tags: [Orders]
 *     summary: Create order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Order created
 */

export default orderRouter;
