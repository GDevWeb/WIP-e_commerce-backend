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

// Swagger Zone

/**
 * @swagger
 * /api/products/{productId}/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get product reviews
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reviews retrieved
 *   post:
 *     tags: [Reviews]
 *     summary: Create review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 */

export default reviewRouter;
