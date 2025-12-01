import { Response } from "express";
import { AuthRequest } from "../../../types/auth.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { getSessionId } from "../../../utils/sessionId";
import * as cartService from "../service/cart.service";

/**
 * Get cart
 * GET /api/cart
 *
 * Retrieves the user's cart.
 * If the user is authenticated, it retrieves the cart associated with their user ID.
 * Otherwise, it retrieves the cart associated with the session ID.
 * If no session ID is present in cookies, a new one is generated and set.
 *
 * @param req - The authentication request object, potentially containing user ID and session ID.
 * @param res - The response object to send back the cart data.
 * @returns A JSON response containing the cart details.
 */

export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const sessionId = getSessionId(req);

  const cart = await cartService.getCart(userId, sessionId);

  // Set session cookie if not already present
  if (!req.cookies?.sessionId) {
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });
  }

  res.status(200).json({
    message: "Cart retrieved successfully",
    data: cart,
  });
});

/**
 * Add item to cart
 * POST /api/cart/items
 *
 *
 * Adds an item to the user's cart.
 * If the user is authenticated, the item is added to their user-specific cart.
 * Otherwise, it's added to the session-specific cart.
 * If no session ID is present in cookies, a new one is generated and set.
 *
 * @param req - The authentication request object, containing product details in `req.body` and potentially user ID and session ID.
 * @param res - The response object to send back the updated cart data.
 * @returns A JSON response containing the updated cart details.
 */

export const addToCart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const sessionId = getSessionId(req);

    const cart = await cartService.addToCart(req.body, userId, sessionId);

    // Set session cookie
    if (!req.cookies?.sessionId) {
      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });
    }

    res.status(200).json({
      message: "Item added to cart successfully",
      data: cart,
    });
  }
);

/**
 * Update cart item quantity
 * PATCH /api/cart/items/:productId
 *
 *
 * Updates the quantity of a specific item in the user's cart.
 * If the user is authenticated, their user-specific cart is updated.
 * Otherwise, the session-specific cart is updated.
 *
 * @param req - The authentication request object, containing `productId` in `req.params` and `quantity` in `req.body`.
 * @param res - The response object to send back the updated cart data.
 * @returns A JSON response containing the updated cart details.
 */

export const updateCartItem = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const sessionId = getSessionId(req);
    const productId = parseInt(req.params.productId);
    const { quantity } = req.body;

    const cart = await cartService.updateCartItem(
      productId,
      quantity,
      userId,
      sessionId
    );

    res.status(200).json({
      message: "Cart updated successfully",
      data: cart,
    });
  }
);

/**
 * Remove item from cart
 * DELETE /api/cart/items/:productId
 *
 *
 * Removes a specific item from the user's cart.
 * If the user is authenticated, the item is removed from their user-specific cart.
 * Otherwise, it's removed from the session-specific cart.
 *
 * @param req - The authentication request object, containing `productId` in `req.params`.
 * @param res - The response object to send back the updated cart data.
 * @returns A JSON response containing the updated cart details.
 */

export const removeFromCart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const sessionId = getSessionId(req);
    const productId = parseInt(req.params.productId);

    const cart = await cartService.removeFromCart(productId, userId, sessionId);

    res.status(200).json({
      message: "Item removed from cart successfully",
      data: cart,
    });
  }
);

/**
 * Clear cart
 * DELETE /api/cart
 *
 *
 * Clears the entire cart for a user or session.
 * If the user is authenticated, their user-specific cart is cleared.
 * Otherwise, the session-specific cart is cleared.
 *
 * @param req - The authentication request object, potentially containing user ID and session ID.
 * @param res - The response object to send back a success message.
 * @returns A JSON response indicating the cart has been cleared.
 */

export const clearCart = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const sessionId = getSessionId(req);

    await cartService.clearCart(userId, sessionId);

    res.status(200).json({
      message: "Cart cleared successfully",
    });
  }
);
