import { z } from "zod";

export const UpdateUserProfileInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").optional(),
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric")
    .optional(),
  headline: z.string().max(100).optional(),
  about: z.string().max(1000).optional(),
});

export type UpdateUserProfileInputDTO = z.infer<typeof UpdateUserProfileInputSchema>;
