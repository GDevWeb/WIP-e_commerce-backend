import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "../../generated/prisma";

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

import * as ProductServiceType from "../../modules/product/service/product.service";

describe("ProductService", () => {
  let productService: typeof ProductServiceType;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(() => {
    prismaMock = mockDeep<PrismaClient>();

    (PrismaClient as jest.Mock).mockImplementation(() => prismaMock);

    productService = require("../../modules/product/service/product.service");
  });

  beforeEach(() => {
    mockReset(prismaMock);
    jest.clearAllMocks();
  });

  describe("getAllProducts", () => {
    it("should return paginated products with filters", async () => {
      const mockProducts = [
        { id: 1, name: "Product 1", price: 100 },
        { id: 2, name: "Product 2", price: 200 },
      ];

      prismaMock.product.findMany.mockResolvedValue(mockProducts as any);
      prismaMock.product.count.mockResolvedValue(2);

      const result = await productService.getAllProducts({
        page: 1,
        pageSize: 10,
        name: "Product",
      });

      expect(prismaMock.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: { contains: "Product", mode: "insensitive" },
          }),
          take: 10,
        })
      );
      expect(result.products).toEqual(mockProducts);
      expect(result.pagination.total).toBe(2);
    });
  });

  describe("createProduct", () => {
    it("should create a product and invalidate search cache", async () => {
      const newProductData = {
        name: "New Product",
        price: 50,
        category_id: 1,
        brand_id: 1,
      };
      const createdProduct = { id: 1, ...newProductData };

      prismaMock.product.create.mockResolvedValue(createdProduct as any);

      redisMock.keys.mockResolvedValue(["search:products:1"]);
      redisMock.del.mockResolvedValue(1);

      const result = await productService.createProduct(newProductData as any);

      expect(prismaMock.product.create).toHaveBeenCalled();
      expect(result).toEqual(createdProduct);
      expect(redisMock.del).toHaveBeenCalled(); // Check cache invalidation
    });
  });

  describe("searchProducts", () => {
    const searchFilters = {
      q: "test",
      page: 1,
      limit: 10,
      sortBy: "createdAt" as const,
      order: "desc" as const,
    };

    const mockDbResult = [
      {
        id: 1,
        name: "Test Product",
        reviews: [{ rating: 5 }],
      },
    ];

    it("should return cached results if available (Cache HIT)", async () => {
      const cachedResult = {
        products: mockDbResult,
        pagination: { total: 1 },
      };

      redisMock.get.mockResolvedValue(JSON.stringify(cachedResult));

      const result = await productService.searchProducts(searchFilters as any);

      expect(redisMock.get).toHaveBeenCalled();
      expect(prismaMock.product.findMany).not.toHaveBeenCalled();
      expect(result).toEqual(cachedResult);
    });

    it("should query DB and cache results if not in cache (Cache MISS)", async () => {
      redisMock.get.mockResolvedValue(null); // Empty vide

      prismaMock.product.findMany.mockResolvedValue(mockDbResult as any);
      prismaMock.product.count.mockResolvedValue(1);

      const result = await productService.searchProducts(searchFilters as any);

      expect(prismaMock.product.findMany).toHaveBeenCalled();

      expect(redisMock.setEx).toHaveBeenCalled();

      expect(result.products[0].name).toBe("Test Product");
    });

    it("should filter results by minRating in memory", async () => {
      redisMock.get.mockResolvedValue(null);

      const lowRatedProduct = {
        id: 2,
        name: "Bad Product",
        reviews: [{ rating: 2 }],
      };

      prismaMock.product.findMany.mockResolvedValue([
        ...mockDbResult,
        lowRatedProduct,
      ] as any);
      prismaMock.product.count.mockResolvedValue(2);

      const result = await productService.searchProducts({
        ...searchFilters,
        minRating: 4,
      } as any);

      expect(result.products).toHaveLength(1);
      expect(result.products[0].name).toBe("Test Product");
    });
  });

  describe("getProductStats", () => {
    it("should return correct statistics", async () => {
      prismaMock.product.count
        .mockResolvedValueOnce(100) // Total
        .mockResolvedValueOnce(5) // Out of stock
        .mockResolvedValueOnce(10); // Low stock

      prismaMock.product.aggregate.mockResolvedValue({
        _sum: { price: 5000 },
      } as any);

      const stats = await productService.getProductStats();

      expect(stats.totalProducts).toBe(100);
      expect(stats.outOfStock).toBe(5);
      expect(stats.totalValue).toBe(5000);
    });
  });
});
