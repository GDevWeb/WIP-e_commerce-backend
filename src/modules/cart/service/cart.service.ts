import dotenv from "dotenv";
import { redisClient } from "../../../configuration/redis";
import { BadRequestError, NotFoundError } from "../../../errors";
import { PrismaClient } from "@prisma/client";
import { AddToCartInput } from "../schema/cart.schema";
import { Cart, CartItem } from "../types/cart.types";

dotenv.config();

const prisma = new PrismaClient();

// TTL cart
const CART_TTL = parseInt(process.env.CART_TTL || "604800");

/**
 * Generates a unique Redis key for a cart based on either a user ID or a session ID.
 * Throws an error if neither a userId nor a sessionId is provided.
 *
 * @param userId - The ID of the user.
 * @param sessionId - The ID of the session.
 * @returns A string representing the Redis key for the cart.
 * @throws Error if both userId and sessionId are undefined.
 */

function getCartKey(userId?: number, sessionId?: string): string {
  if (userId) {
    return `cart:user:${userId}`;
  }
  if (sessionId) {
    return `cart:session:${sessionId}`;
  }
  throw new Error("userId or sessionId required");
}

/**
 * Retrieves a cart from Redis based on a user ID or session ID.
 * If no cart data is found, an empty cart is returned.
 *
 * @param userId - The ID of the user.
 * @param sessionId - The ID of the session.
 * @returns A Promise that resolves to the Cart object.
 */

export const getCart = async (
  userId?: number,
  sessionId?: string
): Promise<Cart> => {
  const key = getCartKey(userId, sessionId);

  const cartData = await redisClient.get(key);

  if (!cartData) {
    return {
      items: [],
      total: 0,
      itemCount: 0,
    };
  }

  return JSON.parse(cartData);
};

/**
 * Saves a cart to Redis with a time-to-live (TTL).
 *
 * @param cart - The cart object to save.
 * @param userId - The ID of the user (optional).
 * @param sessionId - The ID of the session (optional).
 * @returns A Promise that resolves when the cart is saved.
 */

async function saveCart(
  cart: Cart,
  userId?: number,
  sessionId?: string
): Promise<void> {
  const key = getCartKey(userId, sessionId);

  await redisClient.setEx(key, CART_TTL, JSON.stringify(cart));
}

/**
 * Calculates the total price and item count of a given list of cart items.
 *
 * @param items - An array of CartItem objects.
 * @returns A Cart object containing the recalculated items, total price, and item count.
 */

function calculateCart(items: CartItem[]): Cart {
  const total = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  return {
    items,
    total: Number(total.toFixed(2)),
    itemCount,
  };
}

/**
 * Adds a product to the cart or updates its quantity if already present.
 *
 * @param input - The input object containing product_id and quantity.
 * @param userId - The ID of the user (optional).
 * @param sessionId - The ID of the session (optional).
 * @returns A Promise that resolves to the updated Cart object.
 * @throws NotFoundError if the product does not exist.
 * @throws BadRequestError if there is insufficient stock for the requested quantity.
 */

export const addToCart = async (
  input: AddToCartInput,
  userId?: number,
  sessionId?: string
): Promise<Cart> => {
  const { product_id, quantity } = input;

  // Check if product exists and have stock
  const product = await prisma.product.findUnique({
    where: { id: product_id },
    select: {
      id: true,
      name: true,
      price: true,
      stock_quantity: true,
      imageUrl: true,
    },
  });

  if (!product) {
    throw new NotFoundError(`Product #${product_id} not found`);
  }

  if (product.stock_quantity < quantity) {
    throw new BadRequestError(
      `Insufficient stock. Available: ${product.stock_quantity}`
    );
  }

  // Retrieving the current cart
  const cart = await getCart(userId, sessionId);

  // Check if the product is already in the cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product_id === product_id
  );

  if (existingItemIndex >= 0) {
    // If the product is already present -> qty+1
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;

    // Check stock for the qty
    if (product.stock_quantity < newQuantity) {
      throw new BadRequestError(
        `Insufficient stock. Available: ${product.stock_quantity}, ` +
          `In cart: ${cart.items[existingItemIndex].quantity}`
      );
    }

    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // New product -> add to cart
    cart.items.push({
      product_id: product.id,
      quantity,
      price: product.price,
      name: product.name,
      imageUrl: product.imageUrl || undefined,
    });
  }

  // Recalculate and save
  const updatedCart = calculateCart(cart.items);
  await saveCart(updatedCart, userId, sessionId);

  return updatedCart;
};

/**
 * Updates the quantity of a specific item in the cart.
 * If the quantity is set to 0, the item is removed from the cart.
 *
 * @param productId - The ID of the product to update.
 * @param quantity - The new quantity for the product.
 * @param userId - The ID of the user (optional).
 * @param sessionId - The ID of the session (optional).
 * @returns A Promise that resolves to the updated Cart object.
 * @throws NotFoundError if the product is not found in the cart or does not exist.
 * @throws BadRequestError if there is insufficient stock for the requested quantity.
 */

export const updateCartItem = async (
  productId: number,
  quantity: number,
  userId?: number,
  sessionId?: string
): Promise<Cart> => {
  const cart = await getCart(userId, sessionId);

  const itemIndex = cart.items.findIndex(
    (item) => item.product_id === productId
  );

  if (itemIndex === -1) {
    throw new NotFoundError(`Product #${productId} not in cart`);
  }

  if (quantity === 0) {
    // Remove item
    cart.items.splice(itemIndex, 1);
  } else {
    // Check the stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock_quantity: true },
    });

    if (!product) {
      throw new NotFoundError(`Product #${productId} not found`);
    }

    if (product.stock_quantity < quantity) {
      throw new BadRequestError(
        `Insufficient stock. Available: ${product.stock_quantity}`
      );
    }

    // Update qty
    cart.items[itemIndex].quantity = quantity;
  }

  // Recalculate and save
  const updatedCart = calculateCart(cart.items);
  await saveCart(updatedCart, userId, sessionId);

  return updatedCart;
};

/**
 * Removes a specific product from the cart.
 *
 * @param productId - The ID of the product to remove.
 * @param userId - The ID of the user (optional).
 * @param sessionId - The ID of the session (optional).
 * @returns A Promise that resolves to the updated Cart object.
 * @throws NotFoundError if the product is not found in the cart.
 */

export const removeFromCart = async (
  productId: number,
  userId?: number,
  sessionId?: string
): Promise<Cart> => {
  const cart = await getCart(userId, sessionId);

  const itemIndex = cart.items.findIndex(
    (item) => item.product_id === productId
  );

  if (itemIndex === -1) {
    throw new NotFoundError(`Product #${productId} not in cart`);
  }

  // Delete item
  cart.items.splice(itemIndex, 1);

  // Recalculate and save
  const updatedCart = calculateCart(cart.items);
  await saveCart(updatedCart, userId, sessionId);

  return updatedCart;
};

/**
 * Clears the entire cart for a given user or session.
 *
 * @param userId - The ID of the user (optional).
 * @param sessionId - The ID of the session (optional).
 * @returns A Promise that resolves when the cart is cleared.
 */

export const clearCart = async (
  userId?: number,
  sessionId?: string
): Promise<void> => {
  const key = getCartKey(userId, sessionId);
  await redisClient.del(key);
};

/**
 * Merges an anonymous cart (identified by sessionId) into a user's cart (identified by userId).
 * This typically happens after a user logs in.
 *
 * @param userId - The ID of the logged-in user.
 * @param sessionId - The ID of the anonymous session.
 * @returns A Promise that resolves to the merged Cart object.
 */

export const mergeCart = async (
  userId: number,
  sessionId: string
): Promise<Cart> => {
  const sessionCart = await getCart(undefined, sessionId);
  const userCart = await getCart(userId);

  if (sessionCart.items.length === 0) {
    return userCart;
  }

  // Fuze the items
  for (const sessionItem of sessionCart.items) {
    const existingItemIndex = userCart.items.findIndex(
      (item) => item.product_id === sessionItem.product_id
    );

    if (existingItemIndex >= 0) {
      // If item already exists -> add qty
      userCart.items[existingItemIndex].quantity += sessionItem.quantity;
    } else {
      // New item -> add
      userCart.items.push(sessionItem);
    }
  }

  // Recalculate and save
  const mergedCart = calculateCart(userCart.items);
  await saveCart(mergedCart, userId);

  // Delete cart session
  await clearCart(undefined, sessionId);

  return mergedCart;
};
