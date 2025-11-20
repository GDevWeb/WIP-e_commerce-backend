import express from "express";
import { Role } from "../../../generated/prisma";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { checkRole } from "../../../middlewares/checkRole.middleware";
import { validate } from "../../../middlewares/validate";
import { getProductReviews } from "../../review/controller/review.controller";
import { GetProductReviewsSchema } from "../../review/schema/review.schema";
import * as productController from "../controller/product.controller";
import {
  CreateProductSchema,
  DeleteProductSchema,
  SearchProductsSchema,
  UpdateProductSchema,
} from "../schema/product.schema";

const productRouter = express.Router();

// /**
//  * GET /api/products/search
//  * Search product  * Validate the search query *
//  */

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

/**
 * POST /api/products
 * Create product - ADMIN ONLY
 */
productRouter.post(
  "/",
  authMiddleware,
  checkRole([Role.ADMIN]),
  validate(CreateProductSchema),
  productController.createProduct
);

/**
 * PATCH /api/products/:id
 * Update product - ADMIN ONLY
 */
productRouter.patch(
  "/:id",
  authMiddleware,
  checkRole([Role.ADMIN]),
  validate(UpdateProductSchema),
  productController.updateProduct
);

/**
 * DELETE /api/products/:id
 * Delete product - ADMIN ONLY
 */
productRouter.delete(
  "/:id",
  authMiddleware,
  checkRole([Role.ADMIN]),
  validate(DeleteProductSchema),
  productController.deleteProduct
);
export default productRouter;
