import { z } from "zod";

const OrderStatus = z.enum([
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

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

//Schema for retrieving Orders
export const GetOrdersSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    status: z
      .enum([
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
        "REFUNDED",
      ])
      .optional(),
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
      .pipe(z.number().int().min(1).max(100))
      .optional()
      .default(20),
  }),
});

// Schema for retrieve a specific Order
export const GetOrderByIdSchema = z.object({
  body: z.object({}),
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, "Order ID must be a number")
      .transform(Number),
  }),
  query: z.object({}),
});

// Schema for updating order status
export const UpdateOrderStatusSchema = z.object({
  body: z.object({
    status: OrderStatus,
  }),
  params: z.object({
    id: z
      .string()
      .regex(/^\d+$/, "Order ID must be a number")
      .transform(Number),
  }),
  query: z.object({}),
});

// Types
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>["body"];
export type OrderItemInput = z.infer<typeof OrderItemSchema>;
export type GetOrdersQuery = z.infer<typeof GetOrdersSchema>["query"];
export type GetOrderByIdParams = z.infer<typeof GetOrderByIdSchema>["params"];
export type UpdateOrderStatusInput = {
  params: z.infer<typeof UpdateOrderStatusSchema>["params"];
  body: z.infer<typeof UpdateOrderStatusSchema>["body"];
};
