import { z } from "zod";

// Zod schema for validating create post input
export const CreatePostInputSchema = z.object({
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be a string",
    })
    .min(1, "Description cannot be empty")
    .max(1000, "Description is too long"),
});

// Type inferred from schema
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;
