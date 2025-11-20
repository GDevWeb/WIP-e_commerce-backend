import express from "express";
import { Role } from "../../../generated/prisma";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { checkRole } from "../../../middlewares/checkRole.middleware";
import upload from "../../../middlewares/upload.middleware";
import { validate } from "../../../middlewares/validate";
import { getProductReviews } from "../../review/controller/review.controller";
import { GetProductReviewsSchema } from "../../review/schema/review.schema";
import * as productController from "../controller/product.controller";
import { SearchProductsSchema } from "../schema/product.schema";

const productRouter = express.Router();

/**
 * GET /api/products/search
 * Search product  * Validate the search query *
 */

productRouter.get(
  "/search",
  validate(SearchProductsSchema),
  productController.searchProducts
);

/**
 * GET /api/products
 * Get products
 */
productRouter.get("/", productController.getAllProducts);

/**
 * GET /api/products/:productId
 * Get product by id
 */
productRouter.get("/:id", productController.getProduct);

/**
 * POST /api/products/:productId
 * Post product - ADMIN ONLY
 */
productRouter.post(
  "/",
  checkRole([Role.ADMIN]),
  upload.single("imageUrl"),
  productController.createProduct
);

/**
 * PUT /api/products/:productId
 * Put - ADMIN ONLY
 */
productRouter.put(
  "/:id",
  checkRole([Role.ADMIN]),
  productController.updateProduct
);

/**
 * DELETE /api/products/:productId
 * Delete - ADMIN ONLY
 */
productRouter.delete(
  "/:id",
  checkRole([Role.ADMIN]),
  productController.deleteProduct
);

/**
 * GET /api/products/:productId/reviews
 * Get product Reviews
 */
productRouter.get(
  "/:productId/reviews",
  validate(GetProductReviewsSchema),
  getProductReviews
);

/**
 * GET /api/products/admin/stats
 * Get product statistics - ADMIN ONLY
 */
productRouter.get(
  "/admin/stats",
  authMiddleware,
  checkRole([Role.ADMIN]),
  productController.getProductStats
);

export default productRouter;
