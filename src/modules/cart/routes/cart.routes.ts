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

export default cartRouter;
