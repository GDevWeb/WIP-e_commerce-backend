import express from "express";
import { upload } from "../../../configuration/multer.config";
import { Role } from "../../../generated/prisma";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import { checkRole } from "../../../middlewares/checkRole.middleware";
import { validate } from "../../../middlewares/validate";
import { getProductReviews } from "../../review/controller/review.controller";
import { GetProductReviewsSchema } from "../../review/schema/review.schema";
import * as productController from "../controller/product.controller";
import {
  CreateProductFormDataSchema,
  DeleteProductSchema,
  SearchProductsSchema,
  UpdateProductFormDataSchema,
} from "../schema/product.schema";

const productRouter = express.Router();

/**
 * GET /api/products/search
 * Advanced product search with filters
 */
productRouter.get(
  "/search",
  validate(SearchProductsSchema),
  productController.searchProducts
);

/**
 * GET /api/products/admin/stats
 * Get product statistics - ADMIN ONLY
 * Must be BEFORE /:id route
 */
productRouter.get(
  "/admin/stats",
  authMiddleware,
  checkRole([Role.ADMIN]),
  productController.getProductStats
);

/**
 * GET /api/products
 * Get all products with optional filters
 */
productRouter.get("/", productController.getAllProducts);

/**
 * GET /api/products/:id
 * Get single product by ID
 */
productRouter.get("/:id", productController.getProduct);

/**
 * GET /api/products/:productId/reviews
 * Get product reviews
 */
productRouter.get(
  "/:productId/reviews",
  validate(GetProductReviewsSchema),
  getProductReviews
);

/**
 * POST /api/products
 * Create product with optional image - ADMIN ONLY
 */
productRouter.post(
  "/",
  authMiddleware,
  checkRole([Role.ADMIN]),
  upload.single("image"),
  validate(CreateProductFormDataSchema),
  productController.createProduct
);

/**
 * PATCH /api/products/:id
 * Update product with optional new image - ADMIN ONLY
 * Content-Type: multipart/form-data
 * All fields optional, including image
 */
productRouter.patch(
  "/:id",
  authMiddleware,
  checkRole([Role.ADMIN]),
  upload.single("image"),
  validate(UpdateProductFormDataSchema),
  productController.updateProduct
);

/**
 * DELETE /api/products/:id
 * Delete product and its images - ADMIN ONLY
 */
productRouter.delete(
  "/:id",
  authMiddleware,
  checkRole([Role.ADMIN]),
  validate(DeleteProductSchema),
  productController.deleteProduct
);

export default productRouter;
