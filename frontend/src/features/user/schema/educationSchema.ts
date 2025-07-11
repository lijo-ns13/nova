import { z } from "zod";

export const CreateEducationInputSchema = z.object({
  institutionName: z.string().trim().min(1, "Institution is required"),
  degree: z.string().trim().min(1, "Degree is required"),
  fieldOfStudy: z.string().trim().optional(),
  grade: z.string().trim().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().trim().optional(),
});

export type CreateEducationInputDTO = z.infer<
  typeof CreateEducationInputSchema
>;

export const UpdateEducationInputSchema = z
  .object({
    institutionName: z.string().min(2, "Institution name is required"),
    degree: z.string().min(2, "Degree is required"),
    fieldOfStudy: z.string().min(2, "Field of study is required"),
    grade: z
      .string()
      .optional()
      .refine((val) => !val || /^[A-Za-z0-9./% -]+$/.test(val), {
        message: "Invalid characters detected",
      }),
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid start date",
      })
      .refine((val) => new Date(val) <= new Date(), {
        message: "Cannot be in the future",
      }),
    endDate: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Invalid end date",
      }),
    description: z.string().max(500, "Max 500 characters allowed").optional(),
  })
  .refine(
    (data) =>
      !data.endDate || new Date(data.endDate) >= new Date(data.startDate),
    { message: "End date must be after start date", path: ["endDate"] }
  );

export type UpdateEducationInputDTO = z.infer<
  typeof UpdateEducationInputSchema
>;
