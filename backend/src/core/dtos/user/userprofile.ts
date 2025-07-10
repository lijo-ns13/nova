import { z } from "zod";

export const UpdateUserProfileInputSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Only alphanumeric and underscores allowed")
    .optional(),
  name: z.string().min(1).optional(),
  headline: z.string().optional(),
  about: z.string().optional(),
});

export const UpdateProfileImageSchema = z.object({
  imageUrl: z.string().url(),
});

export interface UpdateUserProfileInputDTO {
  username?: string;
  name?: string;
  headline?: string;
  about?: string;
}
