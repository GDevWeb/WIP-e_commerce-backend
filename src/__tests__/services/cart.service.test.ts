import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

const redisMock = {
  isReady: true,
  get: jest.fn(),
  set: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
  exists: jest.fn(),
  expire: jest.fn(),
  ttl: jest.fn(),
  flushAll: jest.fn(),
  quit: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
  on: jest.fn(),
};

jest.mock("../../configuration/redis", () => ({
  redisClient: redisMock,
}));

jest.mock("../../generated/prisma", () => ({
  PrismaClient: jest.fn(),
}));

import { BadRequestError, NotFoundError } from "../../errors";
import * as CartServiceType from "../../modules/cart/service/cart.service";
import { Cart } from "../../modules/cart/types/cart.types";

describe("CartService", () => {
  let cartService: typeof CartServiceType;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(() => {
    process.env.CART_TTL = "3600";

    prismaMock = mockDeep<PrismaClient>();
    (PrismaClient as jest.Mock).mockImplementation(() => prismaMock);

    cartService = require("../../modules/cart/service/cart.service");
  });

  beforeEach(() => {
    mockReset(prismaMock);
    jest.clearAllMocks();
  });

  // Helper pour créer un panier mocké
  const createMockCart = (items: any[] = []): Cart => ({
    items,
    total: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
  });

  describe("getCart", () => {
    it("should return an empty cart if key does not exist in Redis", async () => {
      redisMock.get.mockResolvedValue(null);

      const result = await cartService.getCart(1);

      expect(redisMock.get).toHaveBeenCalledWith("cart:user:1");
      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
    });

    it("should return parsed cart if data exists in Redis", async () => {
      const mockCart = createMockCart([
        { product_id: 1, quantity: 2, price: 10 },
      ]);
      redisMock.get.mockResolvedValue(JSON.stringify(mockCart));

      const result = await cartService.getCart(undefined, "session-123");

      expect(redisMock.get).toHaveBeenCalledWith("cart:session:session-123");
      expect(result).toEqual(mockCart);
    });
  });

  describe("addToCart", () => {
    const input = { product_id: 1, quantity: 2 };
    const mockProduct = {
      id: 1,
      name: "Test Product",
      price: 100,
      stock_quantity: 10,
      imageUrl: "url",
    };

    it("should add a new item to an empty cart", async () => {
      redisMock.get.mockResolvedValue(null);

      prismaMock.product.findUnique.mockResolvedValue(mockProduct as any);

      const result = await cartService.addToCart(input, 1);

      expect(prismaMock.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.any(Object),
      });

      expect(redisMock.setEx).toHaveBeenCalledWith(
        "cart:user:1",
        3600, // TTL
        expect.stringContaining('"product_id":1')
      );

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(200);
    });

    it("should increment quantity if item already in cart", async () => {
      const existingCart = createMockCart([
        {
          product_id: 1,
          quantity: 1,
          price: 100,
          name: "Test Product",
        },
      ]);
      redisMock.get.mockResolvedValue(JSON.stringify(existingCart));

      prismaMock.product.findUnique.mockResolvedValue(mockProduct as any);

      const result = await cartService.addToCart(
        { product_id: 1, quantity: 2 },
        1
      );

      // 1 + 2 = 3
      expect(result.items[0].quantity).toBe(3);
      expect(result.total).toBe(300);
    });

    it("should throw NotFoundError if product not found in DB", async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);

      await expect(cartService.addToCart(input, 1)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw BadRequestError if insufficient stock", async () => {
      prismaMock.product.findUnique.mockResolvedValue({
        ...mockProduct,
        stock_quantity: 1,
      } as any);

      await expect(cartService.addToCart(input, 1)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe("updateCartItem", () => {
    const mockItem = { product_id: 1, quantity: 2, price: 50, name: "Item 1" };

    it("should update quantity if stock is sufficient", async () => {
      // Existing cart with the item
      const existingCart = createMockCart([mockItem]);
      redisMock.get.mockResolvedValue(JSON.stringify(existingCart));

      // Product in DB for stock check
      prismaMock.product.findUnique.mockResolvedValue({
        id: 1,
        stock_quantity: 100,
      } as any);

      // Change quantity to 5
      const result = await cartService.updateCartItem(1, 5, 1);

      expect(result.items[0].quantity).toBe(5);
      expect(result.total).toBe(250); // 5 * 50
      expect(redisMock.setEx).toHaveBeenCalled();
    });

    it("should remove item if quantity is 0", async () => {
      const existingCart = createMockCart([mockItem]);
      redisMock.get.mockResolvedValue(JSON.stringify(existingCart));

      const result = await cartService.updateCartItem(1, 0, 1);

      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it("should throw NotFoundError if item not in cart", async () => {
      const existingCart = createMockCart([]); // Empty cart
      redisMock.get.mockResolvedValue(JSON.stringify(existingCart));

      await expect(cartService.updateCartItem(1, 5, 1)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("removeFromCart", () => {
    it("should remove item from cart", async () => {
      const mockItem = { product_id: 1, quantity: 1, price: 10, name: "Item" };
      const existingCart = createMockCart([mockItem]);
      redisMock.get.mockResolvedValue(JSON.stringify(existingCart));

      const result = await cartService.removeFromCart(1, 1);

      expect(result.items).toHaveLength(0);
      expect(redisMock.setEx).toHaveBeenCalled();
    });

    it("should throw NotFoundError if item not in cart", async () => {
      const existingCart = createMockCart([]);
      redisMock.get.mockResolvedValue(JSON.stringify(existingCart));

      await expect(cartService.removeFromCart(999, 1)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("clearCart", () => {
    it("should delete cart key from Redis", async () => {
      await cartService.clearCart(1);
      expect(redisMock.del).toHaveBeenCalledWith("cart:user:1");
    });
  });

  describe("mergeCart", () => {
    it("should merge session cart into user cart", async () => {
      // 1. Session cart (Anonymous) contains Product A (qty 1)
      const sessionCart = createMockCart([
        { product_id: 1, quantity: 1, price: 10, name: "A" },
      ]);

      // 2. User cart contains Product A (qty 2) and Product B (qty 1)
      const userCart = createMockCart([
        { product_id: 1, quantity: 2, price: 10, name: "A" },
        { product_id: 2, quantity: 1, price: 20, name: "B" },
      ]);

      // Mock successive Redis calls
      redisMock.get
        .mockResolvedValueOnce(JSON.stringify(sessionCart)) // First call: session
        .mockResolvedValueOnce(JSON.stringify(userCart)); // Second call: user

      const result = await cartService.mergeCart(1, "session-123");

      // Verifications
      const itemA = result.items.find((i) => i.product_id === 1);
      const itemB = result.items.find((i) => i.product_id === 2);

      expect(itemA?.quantity).toBe(3);
      expect(itemB?.quantity).toBe(1);

      expect(redisMock.setEx).toHaveBeenCalledWith(
        "cart:user:1",
        expect.any(Number),
        expect.any(String)
      );

      // Delete the old Session cart
      expect(redisMock.del).toHaveBeenCalledWith("cart:session:session-123");
    });

    it("should return user cart if session cart is empty", async () => {
      const sessionCart = createMockCart([]);
      const userCart = createMockCart([
        { product_id: 1, quantity: 1, price: 10, name: "A" },
      ]);

      redisMock.get
        .mockResolvedValueOnce(JSON.stringify(sessionCart))
        .mockResolvedValueOnce(JSON.stringify(userCart));

      const result = await cartService.mergeCart(1, "session-123");

      expect(result).toEqual(userCart);
      expect(redisMock.setEx).not.toHaveBeenCalled();
      expect(redisMock.del).not.toHaveBeenCalled();
    });
  });
});
