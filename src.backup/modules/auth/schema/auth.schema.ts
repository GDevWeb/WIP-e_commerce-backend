import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const RegisterSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address").trim().toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        passwordRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    first_name: z.string().min(2, "First name is required").trim(),
    last_name: z.string().min(2, "Last name is required").trim(),
    phone_number: z
      .string()
      .min(10, "Phone number must be at least 10 characters")
      .optional(),
    address: z.string().optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address").trim().toLowerCase(),
    password: z.string().min(1, "Password is required"),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const UpdateProfileSchema = z.object({
  body: z
    .object({
      first_name: z.string().min(2, "First name is required").trim(),
      last_name: z.string().min(2, "Last name is required").trim(),
      phone_number: z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .optional(),
      address: z.string().optional(),
    })
    .partial(),
  params: z.object({}),
  query: z.object({}),
});

// export const RefreshTokenSchema = z.object({
//   body: z.object({
//     refreshToken: z.string().min(1, "Refresh token cannot be empty"),
//   }),
//   params: z.object({}),
//   query: z.object({}),
// });

export type RegisterInput = z.infer<typeof RegisterSchema>["body"];
export type LoginInput = z.infer<typeof LoginSchema>["body"];
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>["body"];
// export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>["body"];
