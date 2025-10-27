import { z } from "zod";

export const RefreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z
      .string("Refresh token is required")
      .min(1, "Refresh token cannot be empty"),
  }),
  params: z.object({}),
  query: z.object({}),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>["body"];
