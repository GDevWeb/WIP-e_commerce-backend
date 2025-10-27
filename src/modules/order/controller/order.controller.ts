import { Response } from "express";
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
