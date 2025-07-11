import { z } from "zod";

export const CreateExperienceInputSchema = z
  .object({
    title: z.string().trim().min(1, "Job title is required"),
    company: z.string().trim().min(1, "Company name is required"),
    location: z.string().trim().min(1, "Location is required"),
    startDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid start date",
      })
      .refine((val) => new Date(val) <= new Date(), {
        message: "Start date cannot be in the future",
      }),
    endDate: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: "Invalid end date",
      }),
    currentlyWorking: z.boolean(),
    description: z
      .string()
      .trim()
      .max(1000, "Max 1000 characters allowed")
      .optional(),
  })
  .refine(
    (data) =>
      data.currentlyWorking ||
      (data.endDate && new Date(data.endDate) >= new Date(data.startDate)),
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  )
  .refine((data) => data.currentlyWorking || data.endDate, {
    message: "End date is required unless currently working",
    path: ["endDate"],
  });

export type CreateExperienceInputDTO = z.infer<
  typeof CreateExperienceInputSchema
>;

export const UpdateExperienceInputSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    company: z.string().trim().min(1, "Company is required"),
    location: z.string().trim().min(1, "Location is required"),
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
    description: z
      .string()
      .trim()
      .max(500, "Max 500 characters allowed")
      .optional(),
  })
  .refine(
    (data) =>
      !data.endDate || new Date(data.endDate) >= new Date(data.startDate),
    { message: "End date must be after start date", path: ["endDate"] }
  );

export type UpdateExperienceInputDTO = z.infer<
  typeof UpdateExperienceInputSchema
>;
