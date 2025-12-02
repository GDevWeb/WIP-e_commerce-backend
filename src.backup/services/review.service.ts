import { Prisma, PrismaClient, Review } from "../generated/prisma";
import { PaginateReviews, ReviewFilters } from "../types/review.types";

const prisma = new PrismaClient();

export const getAllReviews = async (
  filters: ReviewFilters
): Promise<PaginateReviews> => {
  const {
    productId,
    customerId,
    minRating,
    maxRating,
    page = 1,
    pageSize = 10,
  } = filters;
  const skip = (page - 1) * pageSize;
  const where: Prisma.ReviewWhereInput = {};
  if (productId) {
    where.product_id = productId;
  }

  if (customerId) {
    where.customer_id = customerId;
  }

  if (minRating !== undefined || maxRating !== undefined) {
    where.rating = {};
    if (minRating !== undefined) {
      where.rating.gte = minRating;
    }
    if (maxRating !== undefined) {
      where.rating.lte = maxRating;
    }
  }

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.review.count({ where }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};

export const getReviewById = async (id: number): Promise<Review> => {
  return prisma.review.findUniqueOrThrow({
    where: { id },
  });
};

export const createReview = async (
  data: Prisma.ReviewCreateInput
): Promise<Review> => {
  return prisma.review.create({
    data,
  });
};

export const updateReview = async (
  id: number,
  data: Prisma.ReviewUpdateInput
): Promise<Review> => {
  return prisma.review.update({
    where: { id },
    data,
  });
};

export const deleteReview = async (id: number): Promise<Review> => {
  return prisma.review.delete({
    where: { id },
  });
};

// 🪛check old file - may be unused file an replaced by service in module folder
