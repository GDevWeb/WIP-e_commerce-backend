import { Response } from "express";
import { OrderStatus } from "../../../generated/prisma";
import { AuthRequest } from "../../../types/auth.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import * as orderService from "../service/order.service";

/**
 * Create a new order
 * POST /api/orders
 * Protected route - requires authentication
 */

export const createOrder = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const customerId = req.user!.userId;

    const result = await orderService.createOrder(customerId, req.body);

    res.status(201).json({
      message: "Order created successfully",
      data: result,
    });
  }
);

/**
 * Get all orders for the authenticated user
 * GET /api/orders?status=PENDING&page=1&limit=20
 */
export const getOrders = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const customerId = req.user!.userId;

    const status = req.query.status as OrderStatus | undefined;
    const page = req.query.page
      ? parseInt(req.query.page as string)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;

    const result = await orderService.getOrders(customerId, {
      status,
      page,
      limit,
    });

    res.status(200).json({
      message: "Orders retrieved successfully",
      data: result.orders,
      pagination: result.pagination,
    });
  }
);

/**
 * Get a single order by ID
 * GET /api/orders/:id
 */
export const getOrderById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const customerId = req.user!.userId;
    const orderId = parseInt(req.params.id);

    const order = await orderService.getOrderById(customerId, orderId);

    res.status(200).json({
      message: "Order retrieved successfully",
      data: order,
    });
  }
);

/**
 * Update order status
 * PATCH /api/orders/:id/status
 */
export const updateOrderStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;

    const order = await orderService.updateOrderStatus(orderId, status);

    res.status(200).json({
      message: "Order status updated successfully",
      data: order,
    });
  }
);
