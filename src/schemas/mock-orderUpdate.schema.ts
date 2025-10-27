import z from "zod";

//session 10
// BASE
const OrderBaseSchema = z.object({
  id: z.number().int().positive().optional(),
  customer_id: z.number().int().positive(),
  order_date: z.date().optional(),
  total: z.number().positive(),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// CREATE ORDER
const OrderItemSchema = z.object({
  product_id: z.number().int().positive().min(1, "Product ID is required"),
  quantity: z.number().int().positive().min(1, "Quantity must be at least 1"),
});

export const CreateOrderSchema = z.object({
  body: z.object({
    items: z
      .array(OrderItemSchema)
      .min(1, "Order must contain at least 1 item")
      .max(50, "Order cannot contain more than 50 items"),
  }),
  params: z.object({}),
  query: z.object({}),
});

// UPDATE ORDER

export const UpdateOrderSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: "Order ID must be a valid number",
      })
      .transform(Number),
  }),
  body: OrderBaseSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    customer_id: true,
    order_date: true,
  })
    .partial()
    .strict(),
});

// TYPES

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>["body"];
export type OrderItemInput = z.infer<typeof OrderItemSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
