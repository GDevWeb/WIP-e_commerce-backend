import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "../../generated/prisma";

// 1. Mock Prisma
jest.mock("../../generated/prisma", () => ({
  PrismaClient: jest.fn(),
}));

import { BadRequestError, NotFoundError } from "../../errors";
import * as OrderServiceType from "../../modules/order/service/order.service";

describe("OrderService", () => {
  let orderService: typeof OrderServiceType;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(() => {
    prismaMock = mockDeep<PrismaClient>();
    (PrismaClient as jest.Mock).mockImplementation(() => prismaMock);

    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      //lazy mode any type ><
      return callback(prismaMock);
    });

    orderService = require("../../modules/order/service/order.service");
  });

  beforeEach(() => {
    mockReset(prismaMock);
    prismaMock.$transaction.mockImplementation(async (callback: any) => {
      return callback(prismaMock);
    });
  });

  const mockDate = new Date();
  const mockOrder = {
    id: 1,
    customer_id: 1,
    status: "PENDING",
    total: 100,
    order_date: mockDate,
    createdAt: mockDate,
    updatedAt: mockDate,
    orderItems: [],
  };

  describe("createOrder", () => {
    const input = {
      items: [{ product_id: 1, quantity: 2 }],
    };

    const mockProduct = {
      id: 1,
      name: "Test Product",
      price: 50,
      stock_quantity: 10,
    };

    it("should create an order successfully (Happy Path)", async () => {
      // 1.Mock search products
      prismaMock.product.findMany.mockResolvedValue([mockProduct] as any);

      // 2. Mock create Order (within the transaction)
      prismaMock.order.create.mockResolvedValue(mockOrder as any);

      // 3. Mock create OrderItems
      prismaMock.orderItem.create.mockResolvedValue({
        id: 1,
        order_id: 1,
        product_id: 1,
        quantity: 2,
        price: 50,
      } as any);

      // 4. Mock update stock
      prismaMock.product.update.mockResolvedValue(mockProduct as any);

      // 5. Mock update customer stats
      prismaMock.customer.update.mockResolvedValue({} as any);

      const result = await orderService.createOrder(1, input);

      // VVerifications
      expect(prismaMock.product.findMany).toHaveBeenCalled();

      // Verify total calculation (2 * 50 = 100)
      expect(prismaMock.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ total: 100 }),
        })
      );

      // Verify stock decrement
      expect(prismaMock.product.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { stock_quantity: { decrement: 2 } },
        })
      );

      // Verify formatted response
      expect(result.order.total).toBe(100);
      expect(result.items).toHaveLength(1);
    });

    it("should throw NotFoundError if product not found", async () => {
      // Requesting ID 1, but findMany returns empty
      prismaMock.product.findMany.mockResolvedValue([]);

      await expect(orderService.createOrder(1, input)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw BadRequestError if insufficient stock", async () => {
      // Stock at 1, but requesting 2
      prismaMock.product.findMany.mockResolvedValue([
        { ...mockProduct, stock_quantity: 1 },
      ] as any);

      await expect(orderService.createOrder(1, input)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe("getOrders", () => {
    it("should return paginated orders for a customer", async () => {
      prismaMock.order.findMany.mockResolvedValue([mockOrder] as any);
      prismaMock.order.count.mockResolvedValue(1);

      const result = await orderService.getOrders(1, { page: 1, limit: 10 });

      expect(prismaMock.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { customer_id: 1 },
          take: 10,
        })
      );
      expect(result.orders).toEqual([mockOrder]);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe("getOrderById", () => {
    it("should return order if found and belongs to customer", async () => {
      prismaMock.order.findFirst.mockResolvedValue(mockOrder as any);

      const result = await orderService.getOrderById(1, 1); // customerId: 1, orderId: 1

      expect(prismaMock.order.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1, customer_id: 1 },
        })
      );
      expect(result).toEqual(mockOrder);
    });

    it("should throw NotFoundError if order not found", async () => {
      prismaMock.order.findFirst.mockResolvedValue(null);

      await expect(orderService.getOrderById(1, 999)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("updateOrderStatus", () => {
    // PENDING -> PROCESSING -> SHIPPED -> DELIVERED

    it("should update status for valid transition (PENDING -> PROCESSING)", async () => {
      // Order exists and is PENDING
      prismaMock.order.findUnique.mockResolvedValue({
        ...mockOrder,
        status: "PENDING",
      } as any);

      // Update returns updated order
      prismaMock.order.update.mockResolvedValue({
        ...mockOrder,
        status: "PROCESSING",
      } as any);

      const result = await orderService.updateOrderStatus(
        1,
        "PROCESSING" as any
      );

      expect(prismaMock.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { status: "PROCESSING" },
        })
      );
      expect(result.status).toBe("PROCESSING");
    });

    it("should throw BadRequestError for invalid transition (PENDING -> SHIPPED)", async () => {
      // Cannot transition directly to SHIPPED without going through PROCESSING
      prismaMock.order.findUnique.mockResolvedValue({
        ...mockOrder,
        status: "PENDING",
      } as any);

      await expect(
        orderService.updateOrderStatus(1, "SHIPPED" as any)
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw NotFoundError if order does not exist", async () => {
      prismaMock.order.findUnique.mockResolvedValue(null);

      await expect(
        orderService.updateOrderStatus(999, "PROCESSING" as any)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getAllOrders (Admin)", () => {
    it("should return all orders with filters", async () => {
      prismaMock.order.findMany.mockResolvedValue([mockOrder] as any);
      prismaMock.order.count.mockResolvedValue(1);

      const result = await orderService.getAllOrders({
        status: "PENDING" as any,
      });

      expect(prismaMock.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: "PENDING" },
        })
      );
      expect(result.orders).toHaveLength(1);
    });
  });

  describe("getOrderStats", () => {
    it("should return correct stats", async () => {
      // Mock the 4 parallel calls
      prismaMock.order.count
        .mockResolvedValueOnce(100) // Total
        .mockResolvedValueOnce(10) // Pending
        .mockResolvedValueOnce(5); // Today

      prismaMock.order.aggregate.mockResolvedValue({
        _sum: { total: 5000 },
      } as any);

      const stats = await orderService.getOrderStats();

      expect(stats.totalOrders).toBe(100);
      expect(stats.pendingOrders).toBe(10);
      expect(stats.ordersToday).toBe(5);
      expect(stats.totalRevenue).toBe(5000);
    });
  });
});
