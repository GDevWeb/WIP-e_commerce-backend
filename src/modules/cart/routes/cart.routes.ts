import express from "express";
import { optionalAuthMiddleware } from "../../../middlewares/optionalAuth.middleware";
import { validate } from "../../../middlewares/validate";
import * as cartController from "../controller/cart.controller";
import {
  AddToCartSchema,
  RemoveFromCartSchema,
  UpdateCartItemSchema,
} from "../schema/cart.schema";

const cartRouter = express.Router();

cartRouter.use(optionalAuthMiddleware);

/**
 * GET /api/cart
 * Get cart (works for anonymous and authenticated users)
 */
cartRouter.get("/", cartController.getCart);

/**
 * POST /api/cart/items
 * Add item to cart
 */
cartRouter.post("/items", validate(AddToCartSchema), cartController.addToCart);

/**
 * PATCH /api/cart/items/:productId
 * Update item quantity
 */
cartRouter.patch(
  "/items/:productId",
  validate(UpdateCartItemSchema),
  cartController.updateCartItem
);

/**
 * DELETE /api/cart/items/:productId
 * Remove item from cart
 */
cartRouter.delete(
  "/items/:productId",
  validate(RemoveFromCartSchema),
  cartController.removeFromCart
);

/**
 * DELETE /api/cart
 * Clear entire cart
 */
cartRouter.delete("/", cartController.clearCart);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get user cart
 *     description: Retrieve the current user's shopping cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product_id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: iPhone 15 Pro
 *                           price:
 *                             type: number
 *                             example: 999.99
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           subtotal:
 *                             type: number
 *                             example: 1999.98
 *                     total:
 *                       type: number
 *                       example: 1999.98
 *                     itemCount:
 *                       type: integer
 *                       example: 2
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/cart/items:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add item to cart
 *     description: Add a product to the shopping cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the product to add
 *               quantity:
 *                 type: integer
 *                 example: 2
 *                 minimum: 1
 *                 description: Quantity to add
 *           example:
 *             product_id: 1
 *             quantity: 2
 *     responses:
 *       200:
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item added to cart successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *       400:
 *         description: Invalid product or insufficient stock
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/cart/items/{productId}:
 *   patch:
 *     tags:
 *       - Cart
 *     summary: Update cart item quantity
 *     description: Update the quantity of an item in the cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *                 minimum: 1
 *           example:
 *             quantity: 3
 *     responses:
 *       200:
 *         description: Cart item updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart item updated successfully
 *       400:
 *         description: Invalid quantity or insufficient stock
 *       404:
 *         description: Item not in cart
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Remove item from cart
 *     description: Remove a product from the shopping cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID to remove
 *         example: 1
 *     responses:
 *       200:
 *         description: Item removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item removed from cart successfully
 *       404:
 *         description: Item not in cart
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     tags:
 *       - Cart
 *     summary: Clear entire cart
 *     description: Remove all items from the shopping cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart cleared successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

export default cartRouter;
