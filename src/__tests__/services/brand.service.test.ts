import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

jest.mock("../../generated/prisma", () => ({
  PrismaClient: jest.fn(),
}));

import * as BrandServiceType from "../../modules/brand/service/brand.service";

describe("BrandService", () => {
  let brandService: typeof BrandServiceType;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(() => {
    prismaMock = mockDeep<PrismaClient>();
    (PrismaClient as jest.Mock).mockImplementation(() => prismaMock);

    brandService = require("../../modules/brand/service/brand.service");
  });

  beforeEach(() => {
    mockReset(prismaMock);
  });

  const mockBrand = {
    id: 1,
    name: "Nike",
    createdAt: new Date(),
    updatedAt: new Date(),
    products: [],
  };

  describe("getAllBrands", () => {
    it("should return all brands ordered by name", async () => {
      prismaMock.brand.findMany.mockResolvedValue([mockBrand] as any);

      const result = await brandService.getAllBrands();

      expect(prismaMock.brand.findMany).toHaveBeenCalledWith({
        include: { products: true },
        orderBy: { name: "asc" },
      });
      expect(result).toEqual([mockBrand]);
    });
  });

  describe("getBrandById", () => {
    it("should return a brand if found", async () => {
      prismaMock.brand.findUniqueOrThrow.mockResolvedValue(mockBrand as any);

      const result = await brandService.getBrandById(1);

      expect(prismaMock.brand.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { products: true },
      });
      expect(result).toEqual(mockBrand);
    });

    it("should propagate error if brand not found (findUniqueOrThrow)", async () => {
      const error = new Error("NotFoundError");
      prismaMock.brand.findUniqueOrThrow.mockRejectedValue(error);

      await expect(brandService.getBrandById(999)).rejects.toThrow(
        "NotFoundError"
      );
    });
  });

  describe("createBrand", () => {
    it("should create a brand and TRIM the name", async () => {
      const inputData = { name: "  Adidas  " };
      const createdBrand = { ...mockBrand, name: "Adidas" };

      prismaMock.brand.create.mockResolvedValue(createdBrand as any);

      // Act
      const result = await brandService.createBrand(inputData);

      // Assert
      expect(prismaMock.brand.create).toHaveBeenCalledWith({
        data: {
          name: "Adidas",
        },
      });
      expect(result.name).toBe("Adidas"); //checking trim()
    });
  });

  describe("updateBrand", () => {
    it("should update a brand and TRIM the name if provided", async () => {
      // Arrange
      const updateData = { name: "  Puma  " };
      const updatedBrand = { ...mockBrand, name: "Puma" };

      prismaMock.brand.update.mockResolvedValue(updatedBrand as any);

      // Act
      const result = await brandService.updateBrand(1, updateData);

      // Assert
      expect(prismaMock.brand.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: "Puma" }, // checking trim()
      });
      expect(result.name).toBe("Puma");
    });

    it("should update other fields without failing if name is not provided", async () => {
      const updateData = {};
      prismaMock.brand.update.mockResolvedValue(mockBrand as any);

      // Act
      await brandService.updateBrand(1, updateData as any);

      // Assert
      expect(prismaMock.brand.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {},
      });
    });
  });

  describe("deleteBrand", () => {
    it("should delete a brand", async () => {
      prismaMock.brand.delete.mockResolvedValue(mockBrand as any);

      await brandService.deleteBrand(1);

      expect(prismaMock.brand.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
