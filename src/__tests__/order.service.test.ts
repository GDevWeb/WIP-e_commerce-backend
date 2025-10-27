const prismaMock = {
  order: {
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock("../generated/prisma", () => ({
  PrismaClient: jest.fn().mockImplementation(() => prismaMock),
  Prisma: {
    PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
      code: string;
      meta?: { cause: string };
      constructor(
        message: string,
        { code, meta }: { code: string; meta?: { cause: string } }
      ) {
        super(message);
        this.code = code;
        this.meta = meta;
        this.name = "PrismaClientKnownRequestError";
      }
    },
  },
}));

import { Prisma } from "../generated/prisma";
import * as orderService from "../modules/order/service/order.service";

describe("Order Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockOrder = {
    id: 1,
    customer_id: 1,
    order_date: new Date(),
    total: 199.98,
    status: "PENDING",
    createdAt: new Date(),
    updatedAt: new Date(),
    customer: { id: 1, first_name: "John", last_name: "Doe" },
    orderItems: [
      {
        id: 1,
        product_id: 1,
        quantity: 2,
        price: 99.99,
        product: { id: 1, name: "Test Product" },
      },
    ],
  };

  const includeOptions = {
    customer: true,
    orderItems: {
      include: {
        product: true,
      },
    },
  };

  describe("getAllOrders", () => {
    it("should return all orders with customer and order items", async () => {
      const mockOrders = [mockOrder];
      prismaMock.order.findMany.mockResolvedValue(mockOrders);

      const result = await orderService.getAllOrders();

      expect(result).toEqual(mockOrders);
      expect(prismaMock.order.findMany).toHaveBeenCalledWith({
        include: includeOptions,
      });
    });

    it("should return an empty array if no orders exist", async () => {
      prismaMock.order.findMany.mockResolvedValue([]);
      const result = await orderService.getAllOrders();
      expect(result).toEqual([]);
    });
  });

  describe("getOrderById", () => {
    it("should return a single order by its ID", async () => {
      prismaMock.order.findUniqueOrThrow.mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById(1);

      expect(result).toEqual(mockOrder);
      expect(prismaMock.order.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        include: includeOptions,
      });
    });

    it("should throw an error if the order is not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Record not found",
        { code: "P2025", clientVersion: "5.x" }
      );
      prismaMock.order.findUniqueOrThrow.mockRejectedValue(error);

      await expect(orderService.getOrderById(999)).rejects.toThrow(error);
    });
  });

  describe("createOrder", () => {
    it("should create and return a new order", async () => {
      const newOrderData = {
        customer: { connect: { id: 1 } },
        orderItems: {
          create: [{ product_id: 1, quantity: 2, price: 99.99 }],
        },
        total: 199.98,
        status: "PENDING",
      };

      prismaMock.order.create.mockResolvedValue(mockOrder);

      const result = await orderService.createOrder(newOrderData as any);

      // Vérifier les assertions
      expect(result).toEqual(mockOrder);
      expect(prismaMock.order.create).toHaveBeenCalledWith({
        data: newOrderData,
      });
    });
  });

  describe("updateOrder", () => {
    it("should update and return the order", async () => {
      const updateData: Prisma.OrderUpdateInput = {
        status: "SHIPPED",
      };
      const updatedOrder = { ...mockOrder, status: "SHIPPED" };
      prismaMock.order.update.mockResolvedValue(updatedOrder);

      const result = await orderService.updateOrder(1, updateData);

      expect(result).toEqual(updatedOrder);
      expect(prismaMock.order.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });

    it("should throw an error if the order to update is not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Record to update not found.",
        { code: "P2025", clientVersion: "5.x" }
      );
      prismaMock.order.update.mockRejectedValue(error);

      await expect(
        orderService.updateOrder(999, { status: "CANCELLED" })
      ).rejects.toThrow(error);
    });
  });

  describe("deleteOrder", () => {
    it("should delete and return the order", async () => {
      prismaMock.order.delete.mockResolvedValue(mockOrder);

      const result = await orderService.deleteOrder(1);

      expect(result).toEqual(mockOrder);
      expect(prismaMock.order.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw an error if the order to delete is not found", async () => {
      const error = new Prisma.PrismaClientKnownRequestError(
        "Record to delete does not exist.",
        { code: "P2025", clientVersion: "5.x" }
      );
      prismaMock.order.delete.mockRejectedValue(error);

      await expect(orderService.deleteOrder(999)).rejects.toThrow(error);
    });
  });
});
