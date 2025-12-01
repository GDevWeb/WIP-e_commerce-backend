import { z } from "zod";

const ProductSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1, "Product name is required").max(255).trim(),
  sku: z.string().min(1, "SKU is required").max(50).trim().toUpperCase(),
  imageUrl: z.string().url("Invalid image URL").optional().nullable(),
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

// Schema for JSON format
export const CreateProductSchema = z.object({
  body: ProductSchema.omit({
    id: true,
    sku: true,
    imageUrl: true,
    createdAt: true,
    updatedAt: true,
  }).strict(),
});

// Schema for MultipartFOrm
export const CreateProductFormDataSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Product name is required").max(255).trim(),
    description: z.string().max(1000).optional(),
    weight: z
      .string()
      .transform((val) => (val ? parseFloat(val) : undefined))
      .optional(),
    price: z
      .string()
      .transform((val) => parseFloat(val))
      .pipe(z.number().positive("Price must be positive")),
    stock_quantity: z
      .string()
      .transform((val) => parseInt(val))
      .pipe(z.number().int().nonnegative("Stock cannot be negative")),
    category_id: z
      .string()
      .transform((val) => parseInt(val))
      .pipe(z.number().int().positive("Category ID is required")),
    brand_id: z
      .string()
      .transform((val) => parseInt(val))
      .pipe(z.number().int().positive("Brand ID is required")),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const UpdateProductSchema = z.object({
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

export const UpdateProductFormDataSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: "Product ID must be a valid number",
      })
      .transform(Number),
  }),
  body: z
    .object({
      name: z.string().min(1).max(255).trim().optional(),
      description: z.string().max(1000).optional(),
      weight: z
        .string()
        .transform((val) => (val ? parseFloat(val) : undefined))
        .optional(),
      price: z
        .string()
        .transform((val) => parseFloat(val))
        .pipe(z.number().positive())
        .optional(),
      stock_quantity: z
        .string()
        .transform((val) => parseInt(val))
        .pipe(z.number().int().nonnegative())
        .optional(),
      category_id: z
        .string()
        .transform((val) => parseInt(val))
        .pipe(z.number().int().positive())
        .optional(),
      brand_id: z
        .string()
        .transform((val) => parseInt(val))
        .pipe(z.number().int().positive())
        .optional(),
    })
    .partial(),
  query: z.object({}),
});

export const GetProductsQuerySchema = z.object({
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

export const DeleteProductSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: "Product ID must be a valid number",
      })
      .transform(Number),
  }),
});

// Advanced_search schemas
export const SearchProductsSchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    q: z.string().min(1).max(100).optional(),
    minPrice: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
      .transform(Number)
      .optional(),
    maxPrice: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
      .transform(Number)
      .optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    minRating: z
      .string()
      .regex(/^[1-5]$/, "Rating must be between 1 and 5")
      .transform(Number)
      .optional(),
    inStock: z
      .string()
      .regex(/^(true|false)$/, "Must be true or false")
      .transform((val) => val === "true")
      .optional(),
    sortBy: z
      .enum(["price", "createdAt", "name", "rating", "popularity"])
      .optional()
      .default("createdAt"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
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

// Types
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type CreateProductFormDataInput = z.infer<
  typeof CreateProductFormDataSchema
>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type UpdateProductFormDataInput = z.infer<
  typeof UpdateProductFormDataSchema
>;
export type GetProductsQuery = z.infer<typeof GetProductsQuerySchema>;
export type DeleteProductsQuery = z.infer<typeof DeleteProductSchema>;
export type SearchProductsQuery = z.infer<typeof SearchProductsSchema>["query"];
