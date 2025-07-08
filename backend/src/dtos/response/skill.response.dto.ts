// src/dtos/response/skill.response.dto.ts
import { z } from "zod";

export const SkillResponseSchema = z.object({
  id: z.string(), // Needed for mapping, job relation, etc.
  title: z.string(),
});

export type SkillResponseDTO = z.infer<typeof SkillResponseSchema>;
