import { z } from "zod";

// For review
export const CreateReviewSchema = z.object({
  body: z.object({
    product_id: z.number().int().positive("Product ID must be positive"),
    rating: z
      .number()
      .int()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5"),
    comment: z
      .string()
      .min(10, "Comment must be at least 10 characters")
      .max(500, "Comment must be at most 500 characters")
      .optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

// Retrieving reviews for one product
export const GetProductReviewsSchema = z.object({
  body: z.object({}),
  params: z.object({
    productId: z
      .string()
      .regex(/^\d+$/, "Product ID must be a number")
      .transform(Number),
  }),
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, "Page must be a number")
      .transform(Number)
      .pipe(z.number().int().positive())
      .optional()
      .default(1),
    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be a number")
      .transform(Number)
      .pipe(z.number().int().min(1).max(50))
      .optional()
      .default(10),
  }),
});

// Schema deletion review
export const DeleteReviewSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, "Review ID must be a number")
      .transform(Number),
  }),
  query: z.object({}),
});

// Types
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>["body"];
export type GetProductReviewsParams = z.infer<
  typeof GetProductReviewsSchema
>["params"];
export type GetProductReviewsQuery = z.infer<
  typeof GetProductReviewsSchema
>["query"];
export type DeleteReviewParams = z.infer<typeof DeleteReviewSchema>["params"];
