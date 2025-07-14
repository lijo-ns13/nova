// src/validations/comment/commentSchema.ts
import { z } from "zod";

export const CreateCommentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1),
  parentId: z.string().optional(),
  authorName: z.string().min(1),
});

export const UpdateCommentSchema = z.object({
  commentId: z.string().min(1),
  content: z.string().min(1),
  userId: z.string().min(1),
});
