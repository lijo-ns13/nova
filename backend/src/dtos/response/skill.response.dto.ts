import { z } from "zod";
import { Types } from "mongoose";

// Output DTOs
export const SkillResponseSchema = z.object({
  title: z.string(),
});
export type SkillResponeDTO = z.infer<typeof SkillResponseSchema>;
