import { z } from "zod";

const CategorySchema = z.object({
  id: z.number().int().positive().optional(),
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must not exceed 50 characters")
    .trim()
    .toUpperCase(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// CREATE
export const createCategorySchema = z.object({
  body: CategorySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).strict(),
});

// UPDATE
export const updateCategorySchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: "Category ID must be a valid number",
      })
      .transform(Number),
  }),
  body: CategorySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
    .partial()
    .strict(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
