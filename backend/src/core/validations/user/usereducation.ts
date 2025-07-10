import { z } from "zod";

export const CreateEducationInputSchema = z.object({
  institutionName: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().optional(),
  grade: z.string().optional(),
  startDate: z.coerce.date(), // ✅ string → Date (validated)
  endDate: z.coerce.date().optional(), // ✅ optional date
  description: z.string().optional(),
});

export const UpdateEducationInputSchema = CreateEducationInputSchema.partial();
