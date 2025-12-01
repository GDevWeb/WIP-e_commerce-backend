import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

jest.mock("../../generated/prisma", () => ({
  PrismaClient: jest.fn(),

  Role: {
    ADMIN: "ADMIN",
    CUSTOMER: "CUSTOMER",
  },
}));

import { NotFoundError } from "../../errors";
import * as CustomerServiceType from "../../modules/customer/service/customer.service";

describe("CustomerService", () => {
  let customerService: typeof CustomerServiceType;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(() => {
    prismaMock = mockDeep<PrismaClient>();

    (PrismaClient as jest.Mock).mockImplementation(() => prismaMock);

    customerService = require("../../modules/customer/service/customer.service");
  });

  beforeEach(() => {
    mockReset(prismaMock);
  });

  const mockDate = new Date();
  const mockCustomer = {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    role: "CUSTOMER",
    is_active: true,
    total_orders: 0,
    total_spent: 0,
    createdAt: mockDate,
    updatedAt: mockDate,
  };

  describe("getAllCustomers", () => {
    it("should return paginated customers", async () => {
      prismaMock.customer.findMany.mockResolvedValue([mockCustomer] as any);
      prismaMock.customer.count.mockResolvedValue(1);

      const result = await customerService.getAllCustomers({
        page: 1,
        limit: 10,
      });

      expect(prismaMock.customer.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
          orderBy: { createdAt: "desc" },
        })
      );
      expect(result.customers).toEqual([mockCustomer]);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });
  });

  describe("updateCustomerRole", () => {
    it("should update role if customer exists", async () => {
      prismaMock.customer.findUnique.mockResolvedValue(mockCustomer as any);
      const updatedMock = { ...mockCustomer, role: "ADMIN" };
      prismaMock.customer.update.mockResolvedValue(updatedMock as any);

      const result = await customerService.updateCustomerRole(
        1,
        "ADMIN" as any
      );

      expect(prismaMock.customer.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prismaMock.customer.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { role: "ADMIN" },
        })
      );
      expect(result.role).toBe("ADMIN");
    });

    it("should throw NotFoundError if customer does not exist", async () => {
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(
        customerService.updateCustomerRole(999, "ADMIN" as any)
      ).rejects.toThrow(NotFoundError);

      expect(prismaMock.customer.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteCustomer", () => {
    it("should delete customer if found", async () => {
      prismaMock.customer.findUnique.mockResolvedValue(mockCustomer as any);
      prismaMock.customer.delete.mockResolvedValue(mockCustomer as any);

      await customerService.deleteCustomer(1);

      expect(prismaMock.customer.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw NotFoundError if customer to delete does not exist", async () => {
      prismaMock.customer.findUnique.mockResolvedValue(null);

      await expect(customerService.deleteCustomer(999)).rejects.toThrow(
        NotFoundError
      );

      expect(prismaMock.customer.delete).not.toHaveBeenCalled();
    });
  });

  describe("getCustomerById", () => {
    it("should return customer if found", async () => {
      prismaMock.customer.findUnique.mockResolvedValue(mockCustomer as any);

      const result = await customerService.getCustomerById(1);

      expect(result).toEqual(mockCustomer);
    });

    it("should return null if customer not found", async () => {
      prismaMock.customer.findUnique.mockResolvedValue(null);

      const result = await customerService.getCustomerById(999);

      expect(result).toBeNull();
    });
  });

  describe("createCustomer", () => {
    it("should create a new customer", async () => {
      const newCustomerData = {
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
        phone_number: "1234567890",
        address: "123 St",
      };

      prismaMock.customer.create.mockResolvedValue({
        id: 2,
        ...newCustomerData,
        createdAt: mockDate,
      } as any);

      const result = await customerService.createCustomer(
        newCustomerData as any
      );

      expect(prismaMock.customer.create).toHaveBeenCalledWith({
        data: newCustomerData,
      });
      expect(result.first_name).toBe("Jane");
    });
  });

  describe("updateCustomer", () => {
    it("should update customer data", async () => {
      const updateData = { first_name: "John Updated" };
      prismaMock.customer.update.mockResolvedValue({
        ...mockCustomer,
        first_name: "John Updated",
      } as any);

      const result = await customerService.updateCustomer(1, updateData as any);

      expect(prismaMock.customer.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(result.first_name).toBe("John Updated");
    });
  });
});
