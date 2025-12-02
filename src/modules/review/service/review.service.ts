import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../errors";
import { PrismaClient } from "@prisma/client";
import { CreateReviewInput } from "../schema/review.schema";

const prisma = new PrismaClient();

/**
 * Create a new review for a product.
 *
 * @param customerId - The ID of the customer creating the review.
 * @param input - The review data, including product ID, rating, and an optional comment.
 * @returns The newly created review with customer details.
 * @throws {NotFoundError} If the product does not exist.
 * @throws {ForbiddenError} If the customer has not purchased and received the product.
 * @throws {BadRequestError} If the customer has already reviewed this product.
 */

export const createReview = async (
  customerId: number,
  input: CreateReviewInput
) => {
  const { product_id, rating, comment } = input;

  // 1 : Check if the product exists
  const product = await prisma.product.findUnique({
    where: { id: product_id },
  });

  if (!product) {
    throw new NotFoundError(`Product #${product_id} not found`);
  }

  // 2 : Check if the customer has purchased the product
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      product_id: product_id,
      order: {
        customer_id: customerId,
        status: "DELIVERED",
      },
    },
  });

  if (!hasPurchased) {
    throw new ForbiddenError(
      "You can only review products you have purchased and received"
    );
  }

  // 3 : Check if one review already exists
  const existingReview = await prisma.review.findFirst({
    where: {
      product_id: product_id,
      customer_id: customerId,
    },
  });

  if (existingReview) {
    throw new BadRequestError(
      "You have already reviewed this product. You can delete your existing review and create a new one."
    );
  }

  // 4 : Create the review
  const review = await prisma.review.create({
    data: {
      product_id,
      customer_id: customerId,
      rating,
      comment: comment || null,
    },
    include: {
      customer: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      },
    },
  });

  // 5 : Recalculate the average rating of the product
  await updateProductRating(product_id);

  return review;
};

/**
 * Retrieve reviews for a specific product with pagination and rating statistics.
 *
 * @param productId - The ID of the product to retrieve reviews for.
 * @param options - Pagination options including page number and limit.
 * @returns An object containing the reviews, statistics (total, average rating, distribution), and pagination info.
 * @throws {NotFoundError} If the product does not exist.
 */
export const getProductReviews = async (
  productId: number,
  options: { page?: number; limit?: number }
) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  // 1 : Check if the product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new NotFoundError(`Product #${productId} not found`);
  }

  // Retrieving product with pagination
  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { product_id: productId },
      include: {
        customer: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.review.count({
      where: { product_id: productId },
    }),
  ]);

  // Calculate stats
  const ratings = await prisma.review.groupBy({
    by: ["rating"],
    where: { product_id: productId },
    _count: {
      rating: true,
    },
  });

  const ratingDistribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  ratings.forEach((r) => {
    ratingDistribution[r.rating as 1 | 2 | 3 | 4 | 5] = r._count.rating;
  });

  const averageRating =
    total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;

  return {
    reviews,
    stats: {
      total,
      averageRating: Number(averageRating.toFixed(1)),
      distribution: ratingDistribution,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Delete a review.
 * Only the author of the review can delete it.
 *
 * @param customerId - The ID of the customer attempting to delete the review.
 * @param reviewId - The ID of the review to be deleted.
 * @returns A success message if the review is deleted.
 * @throws {NotFoundError} If the review does not exist.
 * @throws {ForbiddenError} If the customer is not the author of the review.
 */

export const deleteReview = async (customerId: number, reviewId: number) => {
  // 1.Find the review
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new NotFoundError(`Review #${reviewId} not found`);
  }

  // 2.Check if the author exists
  if (review.customer_id !== customerId) {
    throw new ForbiddenError("You can only delete your own reviews");
  }

  // 3.Delete the review
  await prisma.review.delete({
    where: { id: reviewId },
  });

  // 4.Recalculate the product average
  await updateProductRating(review.product_id);

  return { message: "Review deleted successfully" };
};
/**
 * Helper: Recalculate product average rating
 * Called after create/delete review
 *
 * @param productId - The ID of the product for which to update the average rating.
 * @returns The newly calculated average rating for the product.
 */

async function updateProductRating(productId: number) {
  const reviews = await prisma.review.findMany({
    where: { product_id: productId },
    select: { rating: true },
  });

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // 🪛to fix - after the TEST step
  // await prisma.product.update({
  //   where: { id: productId },
  //   data: { average_rating: averageRating },
  // });

  return averageRating;
}
