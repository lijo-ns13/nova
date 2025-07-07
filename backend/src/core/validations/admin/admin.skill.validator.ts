import { z } from "zod";

export const CreateSkillSchema = z.object({
  title: z.string().trim().min(1, "Skill title is required"),
});

export const UpdateSkillSchema = z.object({
  title: z.string().trim().min(1, "Skill title is required"),
});
