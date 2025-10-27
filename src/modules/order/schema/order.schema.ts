import { z } from "zod";

//For an item
const OrderItemSchema = z.object({
  product_id: z.number().int().positive("Product ID must be positive"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

// For an order
export const CreateOrderSchema = z.object({
  body: z.object({
    items: z
      .array(OrderItemSchema)
      .min(1, "Order must contain at least one item")
      .max(50, "Order cannot contain more than 50 items"),
  }),
  params: z.object({}),
  query: z.object({}),
});

// Types
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>["body"];
export type OrderItemInput = z.infer<typeof OrderItemSchema>;
