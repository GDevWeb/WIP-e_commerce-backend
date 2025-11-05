import { z } from "zod";

const ProductSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1, "Product name is required").max(255).trim(),
  sku: z.string().min(1, "SKU is required").max(50).trim().toUpperCase(),
  imageUrl: z.url("Invalid image URL").optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  weight: z.number().positive("Weight must be positive").optional().nullable(),
  price: z.number().positive("Price must be positive"),
  stock_quantity: z
    .number()
    .int()
    .nonnegative("Stock cannot be negative")
    .default(0),
  category_id: z.number().int().positive("Category ID is required"),
  brand_id: z.number().int().positive("Brand ID is required"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createProductSchema = z.object({
  body: ProductSchema.omit({
    id: true,
    sku: true,
    createdAt: true,
    updatedAt: true,
  }).strict(),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: "Product ID must be a valid number",
      })
      .transform(Number),
  }),
  body: ProductSchema.omit({
    id: true,
    sku: true,
    createdAt: true,
    updatedAt: true,
  })
    .partial()
    .strict(),
});

export const getProductsQuerySchema = z.object({
  query: z
    .object({
      name: z.string().optional(),
      category: z.string().optional(),
      brand: z.string().optional(),
      minPrice: z.string().transform(Number).optional(),
      maxPrice: z.string().transform(Number).optional(),
      page: z.string().transform(Number).default(1),
      pageSize: z.string().transform(Number).default(10),
    })
    .optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetProductsQuery = z.infer<typeof getProductsQuerySchema>;
