import { z } from "zod";

// Add
export const AddToCartSchema = z.object({
  body: z.object({
    product_id: z.number().int().positive("Product ID must be positive"),
    quantity: z
      .number()
      .int()
      .min(1, "Quantity must be at least 1")
      .max(100, "Quantity cannot exceed 100"),
  }),
  params: z.object({}),
  query: z.object({}),
});

// Update quantity
export const UpdateCartItemSchema = z.object({
  body: z.object({
    quantity: z
      .number()
      .int()
      .min(0, "Quantity be at least 0")
      .max(100, "Quantity cannot exceed 100"),
  }),
  params: z.object({
    productId: z
      .string()
      .regex(/^\d+$/, "Product ID must be a number")
      .transform(Number),
  }),
  query: z.object({}),
});

// Delete
export const RemoveFromCartSchema = z.object({
  body: z.object({}),
  params: z.object({
    productId: z
      .string()
      .regex(/^\d+$/, "Product ID must be a number")
      .transform(Number),
  }),
  query: z.object({}),
});

// Types
export type AddToCartInput = z.infer<typeof AddToCartSchema>["body"];
export type UpdateCartItemInput = {
  params: z.infer<typeof UpdateCartItemSchema>["params"];
  body: z.infer<typeof UpdateCartItemSchema>["body"];
};
export type RemoveFromCartParams = z.infer<
  typeof RemoveFromCartSchema
>["params"];
