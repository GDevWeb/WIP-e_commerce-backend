import express from "express";
import { upload } from "../../../configuration/multer.config";
import { apiWriteLimiter } from "../../../configuration/security.config";
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
  apiWriteLimiter,
  productController.getProductStats
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     description: Retrieve a list of products with optional filters and pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by product name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand name
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */

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
 * @swagger
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product (ADMIN only)
 *     description: Create a new product with optional image upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock_quantity
 *               - category_id
 *               - brand_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: MacBook Pro 16"
 *               description:
 *                 type: string
 *                 example: Powerful laptop for professionals
 *               price:
 *                 type: number
 *                 example: 2499.99
 *               stock_quantity:
 *                 type: integer
 *                 example: 15
 *               weight:
 *                 type: number
 *                 example: 2.1
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               brand_id:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Product image (optional)
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

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
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 *   patch:
 *     tags: [Products]
 *     summary: Update product (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock_quantity:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 *   delete:
 *     tags: [Products]
 *     summary: Delete product (ADMIN only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product deleted
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

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
