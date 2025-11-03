import express from "express";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { validate } from "../../../middlewares/validate";
import * as reviewController from "../controller/review.controller";
import {
  CreateReviewSchema,
  DeleteReviewSchema,
} from "../schema/review.schema";

const reviewRouter = express.Router();

/**
 * POST /api/reviews
 * Create a review
 */
reviewRouter.post(
  "/",
  authMiddleware,
  validate(CreateReviewSchema),
  reviewController.createReview
);

/**
 * DELETE /api/reviews/:id
 * Delete a review (own review only)
 */
reviewRouter.delete(
  "/:id",
  authMiddleware,
  validate(DeleteReviewSchema),
  reviewController.deleteReview
);

export default reviewRouter;
