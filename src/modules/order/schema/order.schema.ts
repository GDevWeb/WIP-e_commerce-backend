import { z } from "zod";

//Individual item
const orderItemBody = z.object({
  product_id: z
    .number()
    .int()
    .positive()
    .min(1, "Product ID must be at least 1"),
  quantity: z
    .number()
    .int()
    .positive()
    .min(1, "Quantity must be at least 1")
    .max(50, "Quantity cannot exceed 50"),
});

//Order
export const CreateOrderSchema = z.object({
  body: z.object({
    items: z
      .array(orderItemBody)
      .min(1, "Order must contain at least 1 item")
      .max(50, "Order cannot have more than 50 items"),
  }),
  params: z.object({}),
  query: z.object({}),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>["body"];
export type OrderItemInput = z.infer<typeof orderItemBody>;
