import { z } from "zod";

export const CreateExperienceInputSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  description: z.string().optional(),
  location: z.string(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  endDate: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val === "" || !isNaN(Date.parse(val)),
      { message: "Invalid end date" }
    ),
});

export const UpdateExperienceInputSchema =
  CreateExperienceInputSchema.partial();
