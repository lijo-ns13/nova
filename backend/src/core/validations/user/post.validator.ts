import { z } from "zod";

export const createPostSchema = z.object({
  description: z.string().min(1).max(1000),
});

export const updatePostSchema = z.object({
  description: z.string().min(1).max(1000),
});
