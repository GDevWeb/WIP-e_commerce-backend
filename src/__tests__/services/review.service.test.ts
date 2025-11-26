import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";
import { PrismaClient } from "../../generated/prisma";

jest.mock("../../generated/prisma", () => ({
  PrismaClient: jest.fn(),
}));

import { BadRequestError, ForbiddenError, NotFoundError } from "../../errors";
import * as ReviewServiceType from "../../modules/review/service/review.service";

describe("ReviewService", () => {
  let reviewService: typeof ReviewServiceType;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeAll(() => {
    prismaMock = mockDeep<PrismaClient>();
    (PrismaClient as jest.Mock).mockImplementation(() => prismaMock);

    reviewService = require("../../modules/review/service/review.service");
  });

  beforeEach(() => {
    mockReset(prismaMock);
  });

  const mockDate = new Date();
  const mockReview = {
    id: 1,
    product_id: 100,
    customer_id: 1,
    rating: 5,
    comment: "Great product!",
    createdAt: mockDate,
    updatedAt: mockDate,
    customer: { id: 1, first_name: "John", last_name: "Doe" },
  };

  describe("createReview", () => {
    const input = {
      product_id: 100,
      rating: 5,
      comment: "Great product!",
    };

    it("should create a review if allowed", async () => {
      // 1. Mock: The product exists
      prismaMock.product.findUnique.mockResolvedValue({ id: 100 } as any);

      // 2. Mock: The customer has purchased the product (Status DELIVERED)
      prismaMock.orderItem.findFirst.mockResolvedValue({ id: 1 } as any);

      // 3. Mock: No existing review
      prismaMock.review.findFirst.mockResolvedValue(null);

      // 4. Mock: Creation of the review
      prismaMock.review.create.mockResolvedValue(mockReview as any);

      // 5. Mock: updateProductRating (called internally)
      // It does a findMany to recalculate the average
      prismaMock.review.findMany.mockResolvedValue([mockReview] as any);

      const result = await reviewService.createReview(1, input);

      expect(prismaMock.review.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            product_id: 100,
            customer_id: 1,
            rating: 5,
          }),
        })
      );
      expect(result).toEqual(mockReview);
    });

    it("should throw NotFoundError if product does not exist", async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);

      await expect(reviewService.createReview(1, input)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw ForbiddenError if user has not purchased product", async () => {
      prismaMock.product.findUnique.mockResolvedValue({ id: 100 } as any);
      prismaMock.orderItem.findFirst.mockResolvedValue(null);

      await expect(reviewService.createReview(1, input)).rejects.toThrow(
        ForbiddenError
      );
    });

    it("should throw BadRequestError if user already reviewed product", async () => {
      prismaMock.product.findUnique.mockResolvedValue({ id: 100 } as any);
      prismaMock.orderItem.findFirst.mockResolvedValue({ id: 1 } as any);
      prismaMock.review.findFirst.mockResolvedValue(mockReview as any);

      await expect(reviewService.createReview(1, input)).rejects.toThrow(
        BadRequestError
      );
    });
  });

  describe("getProductReviews", () => {
    it("should return reviews and stats", async () => {
      prismaMock.product.findUnique.mockResolvedValue({ id: 100 } as any);

      prismaMock.review.findMany.mockResolvedValue([mockReview] as any);
      prismaMock.review.count.mockResolvedValue(1);

      prismaMock.review.groupBy.mockResolvedValue([
        { rating: 5, _count: { rating: 1 } },
      ] as any);

      const result = await reviewService.getProductReviews(100, {
        page: 1,
        limit: 10,
      });

      expect(result.reviews).toEqual([mockReview]);
      expect(result.stats.total).toBe(1);
      expect(result.stats.averageRating).toBe(5.0);
      expect(result.stats.distribution[5]).toBe(1);
    });

    it("should throw NotFoundError if product does not exist", async () => {
      prismaMock.product.findUnique.mockResolvedValue(null);

      await expect(reviewService.getProductReviews(999, {})).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("deleteReview", () => {
    it("should delete review if owner", async () => {
      // 1. Review exists and belongs to the user (customer_id: 1)

      prismaMock.review.findUnique.mockResolvedValue(mockReview as any);

      // 2. Mock Delete
      prismaMock.review.delete.mockResolvedValue(mockReview as any);

      // 3. Mock updateProductRating (findMany called after delete)
      prismaMock.review.findMany.mockResolvedValue([]);

      const result = await reviewService.deleteReview(1, 10);

      expect(prismaMock.review.delete).toHaveBeenCalledWith({
        where: { id: 10 },
      });
      expect(result.message).toContain("deleted successfully");
    });

    it("should throw NotFoundError if review not found", async () => {
      prismaMock.review.findUnique.mockResolvedValue(null);

      await expect(reviewService.deleteReview(1, 999)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw ForbiddenError if not owner", async () => {
      // Review belongs to ID 2, but ID 1 tries to delete it
      prismaMock.review.findUnique.mockResolvedValue({
        ...mockReview,
        customer_id: 2,
      } as any);

      await expect(reviewService.deleteReview(1, 10)).rejects.toThrow(
        ForbiddenError
      );
    });
  });
});
