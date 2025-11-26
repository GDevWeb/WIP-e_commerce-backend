import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "../../generated/prisma";

jest.mock("../../generated/prisma", () => ({
  PrismaClient: jest.fn(),
}));

import * as CategoryServiceType from "../../modules/category/service/category.service";

describe("CategoryService", () => {
  let categoryService: typeof CategoryServiceType;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(() => {
    prismaMock = mockDeep<PrismaClient>();
    (PrismaClient as jest.Mock).mockImplementation(() => prismaMock);

    categoryService = require("../../modules/category/service/category.service");
  });

  beforeEach(() => {
    mockReset(prismaMock);
  });

  const mockCategory = {
    id: 1,
    name: "SHOES",
    createdAt: new Date(),
    updatedAt: new Date(),
    products: [],
  };

  describe("getAllCategories", () => {
    it("should return all categories ordered by name", async () => {
      prismaMock.category.findMany.mockResolvedValue([mockCategory] as any);

      const result = await categoryService.getAllCategories();

      // Assert
      expect(prismaMock.category.findMany).toHaveBeenCalledWith({
        include: { products: true },
        orderBy: { name: "asc" },
      });
      expect(result).toEqual([mockCategory]);
    });
  });

  describe("getCategoryById", () => {
    it("should return a category if found", async () => {
      // Arrange
      prismaMock.category.findUniqueOrThrow.mockResolvedValue(
        mockCategory as any
      );

      const result = await categoryService.getCategoryById(1);

      expect(prismaMock.category.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { products: true },
      });
      expect(result).toEqual(mockCategory);
    });

    it("should propagate error if category not found", async () => {
      const error = new Error("NotFoundError");
      prismaMock.category.findUniqueOrThrow.mockRejectedValue(error);

      await expect(categoryService.getCategoryById(999)).rejects.toThrow(
        "NotFoundError"
      );
    });
  });

  describe("createCategory", () => {
    it("should create a category and Normalize (UPPERCASE + TRIM) the name", async () => {
      const inputData = { name: "  sneakers  " }; // Minuscules avec espaces
      const createdCategory = { ...mockCategory, name: "SNEAKERS" };

      prismaMock.category.create.mockResolvedValue(createdCategory as any);

      const result = await categoryService.createCategory(inputData);

      expect(prismaMock.category.create).toHaveBeenCalledWith({
        data: {
          name: "SNEAKERS", // Important : checking Uppercase + Trim
        },
      });
      expect(result.name).toBe("SNEAKERS");
    });
  });

  describe("updateCategory", () => {
    it("should update a category and Normalize the name if provided", async () => {
      // Arrange
      const updateData = { name: "  running shoes  " };
      const updatedCategory = { ...mockCategory, name: "RUNNING SHOES" };

      prismaMock.category.update.mockResolvedValue(updatedCategory as any);

      // Act
      const result = await categoryService.updateCategory(1, updateData);

      // Assert
      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: "RUNNING SHOES" }, // Important : checking Uppercase + Trim
      });
      expect(result.name).toBe("RUNNING SHOES");
    });

    it("should update without changing name if not provided", async () => {
      // Arrange
      const updateData = {};
      prismaMock.category.update.mockResolvedValue(mockCategory as any);

      // Act
      await categoryService.updateCategory(1, updateData as any);

      // Assert
      expect(prismaMock.category.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {}, // The name should not be touched
      });
    });
  });

  describe("deleteCategory", () => {
    it("should delete a category", async () => {
      prismaMock.category.delete.mockResolvedValue(mockCategory as any);

      await categoryService.deleteCategory(1);

      expect(prismaMock.category.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
