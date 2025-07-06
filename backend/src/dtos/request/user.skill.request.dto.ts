import { z } from "zod";

export const AddUserSkillSchema = z.object({
  title: z.string().min(1),
});
export type AddUserSkillDTO = z.infer<typeof AddUserSkillSchema>;

export const RemoveUserSkillSchema = z.object({
  skillId: z.string().min(1),
});
export type RemoveUserSkillDTO = z.infer<typeof RemoveUserSkillSchema>;
