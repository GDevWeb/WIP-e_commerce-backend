import { NotFoundError } from "../../errors";
import * as customerService from "../../modules/customer/service/customer.service";
import { createMockCustomer, mockCustomer } from "../__mocks__/fixtures";
import { prismaMock } from "../__mocks__/prisma.mock";

jest.mock("../../generated/prisma", () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));

describe("CustomerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCustomerById", () => {
    it("should return a customer by id", async () => {
      // Arrange
      prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);

      // Act
      const result = await customerService.getCustomerById(1);

      // Assert
      expect(result).toEqual(mockCustomer);
      expect(prismaMock.customer.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw NotFoundError if customer not found", async () => {
      // Arrange
      prismaMock.customer.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(customerService.getCustomerById(999)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("createCustomer", () => {
    it("should create a new customer", async () => {
      // Arrange
      const newCustomerData = {
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@test.com",
        phone_number: "0987654321",
        address: "456 Oak Ave",
      };

      const createdCustomer = createMockCustomer({
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@test.com",
      });

      prismaMock.customer.create.mockResolvedValue(createdCustomer);

      // Act
      const result = await customerService.createCustomer(newCustomerData);

      // Assert
      expect(result).toEqual(createdCustomer);
      expect(prismaMock.customer.create).toHaveBeenCalledWith({
        data: newCustomerData,
      });
    });

    it("should handle duplicate email error", async () => {
      // Arrange
      const duplicateData = {
        first_name: "John",
        last_name: "Doe",
        email: "john@test.com", // Already exists
        phone_number: "0123456789",
        address: "123 Main St",
      };

      prismaMock.customer.create.mockRejectedValue({
        code: "P2002",
        meta: { target: ["email"] },
      });

      // Act & Assert
      await expect(
        customerService.createCustomer(duplicateData)
      ).rejects.toThrow();
    });
  });

  describe("updateCustomer", () => {
    it("should update a customer", async () => {
      // Arrange
      const updateData = { phone_number: "0999999999" };
      const updatedCustomer = createMockCustomer({
        phone_number: "0999999999",
      });

      prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);
      prismaMock.customer.update.mockResolvedValue(updatedCustomer);

      // Act
      const result = await customerService.updateCustomer(1, updateData);

      // Assert
      expect(result).toEqual(updatedCustomer);
      expect(prismaMock.customer.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
    });
  });

  describe("updateCustomerRole", () => {
    it("should update customer role", async () => {
      // Arrange
      const updatedCustomer = createMockCustomer({ role: "MANAGER" });

      prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);
      prismaMock.customer.update.mockResolvedValue(updatedCustomer);

      // Act
      const result = await customerService.updateCustomerRole(1, "MANAGER");

      // Assert
      expect(result.role).toBe("MANAGER");
      expect(prismaMock.customer.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { role: "MANAGER" },
        select: expect.any(Object),
      });
    });
  });

  describe("deleteCustomer", () => {
    it("should delete a customer", async () => {
      // Arrange
      prismaMock.customer.findUnique.mockResolvedValue(mockCustomer);
      prismaMock.customer.delete.mockResolvedValue(mockCustomer);

      // Act
      await customerService.deleteCustomer(1);

      // Assert
      expect(prismaMock.customer.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should throw NotFoundError if customer not found", async () => {
      // Arrange
      prismaMock.customer.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(customerService.deleteCustomer(999)).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("getAllCustomers", () => {
    it("should return paginated customers", async () => {
      // Arrange
      const mockCustomers = [
        createMockCustomer({ id: 1 }),
        createMockCustomer({ id: 2 }),
      ];

      prismaMock.customer.findMany.mockResolvedValue(mockCustomers);
      prismaMock.customer.count.mockResolvedValue(2);

      // Act
      const result = await customerService.getAllCustomers({
        page: 1,
        limit: 20,
      });

      // Assert
      expect(result.customers).toEqual(mockCustomers);
      expect(result.pagination.total).toBe(2);
    });
  });
});
