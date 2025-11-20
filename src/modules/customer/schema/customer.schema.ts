import { z } from "zod";
import { ContactMethod, CustomerType, Role } from "../../../generated/prisma";

const customerTypeSchema = z.enum(CustomerType);
const contactMethodSchema = z.enum(ContactMethod);

const CustomerSchema = z.object({
  id: z.number().int().positive().optional(),
  first_name: z.string().min(1, "First name is required").trim(),
  last_name: z.string().min(1, "Last name is required").trim(),
  email: z.email("Invalid email address").toLowerCase().trim(),
  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  date_of_birth: z.coerce
    .date()
    .max(new Date(), "Date of birth cannot be in the future")
    .optional(),
  is_active: z.boolean().optional(),
  last_purchase_date: z.date().optional(),
  total_orders: z.number().int().nonnegative().optional(),
  total_spent: z.number().nonnegative().optional(),
  customer_type: customerTypeSchema.optional(),
  preferred_contact_method: contactMethodSchema.optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createCustomerSchema = z.object({
  body: CustomerSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    total_orders: true,
    total_spent: true,
    last_purchase_date: true,
  }),
});

//URL params
export const customerIdParamSchema = z.object({
  id: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Customer ID must be a valid number",
    })
    .transform(Number),
});

// Update
export const updateCustomerSchema = z.object({
  params: customerIdParamSchema,
  body: CustomerSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial(),
});

export const UpdateCustomerRoleSchema = z.object({
  body: z.object({
    role: z.enum(Role),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/).transform(Number),
  }),
  query: z.object({}),
});
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CustomerIdParam = z.infer<typeof customerIdParamSchema>;
