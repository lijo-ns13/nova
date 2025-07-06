import { z } from "zod";
import { Types } from "mongoose";

// export const SkillSearchRequestSchema = z.object({
//   title: z.string(),
// });

// export type SkillRequestDTO = z.infer<typeof SkillSearchRequestSchema>;

// Accept ?q=something or ?page=2&limit=10
export const SkillSearchRequestSchema = z.object({
  q: z.string().min(1).optional().default(""),
});

export type SkillSearchRequestDTO = z.infer<typeof SkillSearchRequestSchema>;
