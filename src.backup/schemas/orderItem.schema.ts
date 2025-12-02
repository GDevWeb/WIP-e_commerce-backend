import { z } from "zod";

const OrderItemSchema = z.object({
  id: z.number().int().positive().optional(),
  order_id: z.number().int().positive(),
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createOrderItemSchema = z.object({
  body: OrderItemSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).strict(),
});

export const updateOrderItemSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: "Order Item ID must be a valid number",
      })
      .transform(Number),
  }),
  body: OrderItemSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
    .partial()
    .strict(),
});

export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;
export type UpdateOrderItemInput = z.infer<typeof updateOrderItemSchema>;
