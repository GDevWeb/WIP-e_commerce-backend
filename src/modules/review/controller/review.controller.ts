import { Response } from "express";
import { AuthRequest } from "../../../types/auth.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import * as reviewService from "../service/review.service";

/**
 * Create a new review for a product.
 * POST /api/reviews
 */
export const createReview = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const customerId = req.user!.userId;

    const review = await reviewService.createReview(customerId, req.body);

    res.status(201).json({
      message: "Review created successfully",
      data: review,
    });
  }
);

/**
 * Get all reviews for a product
 * GET /api/products/:productId/reviews
 */
export const getProductReviews = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const productId = parseInt(req.params.productId);
    const { page, limit } = req.query as any;

    const result = await reviewService.getProductReviews(productId, {
      page,
      limit,
    });

    res.status(200).json({
      message: "Reviews retrieved successfully",
      data: result.reviews,
      stats: result.stats,
      pagination: result.pagination,
    });
  }
);

/**
 * Delete a review
 * DELETE /api/reviews/:id
 */
export const deleteReview = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const customerId = req.user!.userId;
    const reviewId = parseInt(req.params.id);

    const result = await reviewService.deleteReview(customerId, reviewId);

    res.status(200).json(result);
  }
);
