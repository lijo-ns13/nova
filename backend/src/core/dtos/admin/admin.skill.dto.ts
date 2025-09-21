import { z } from "zod";

export const CreateSkillSchema = z.object({
  title: z.string().min(1, "Title is required"),
});
export type CreateSkillDto = z.infer<typeof CreateSkillSchema>;

export const UpdateSkillSchema = z.object({
  title: z.string().min(1, "Title is required"),
});
export type UpdateSkillDto = z.infer<typeof UpdateSkillSchema>;
