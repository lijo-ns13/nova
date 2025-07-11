import { z } from "zod";

export const CreateProjectInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  projectUrl: z.string().trim().url("Invalid URL").optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid startDate" }),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid endDate",
    }),
  technologies: z
    .array(z.string().trim())
    .min(1, "At least one technology is required"),
});

export type CreateProjectInputDTO = z.infer<typeof CreateProjectInputSchema>;
export const UpdateProjectInputSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().min(1, "Description is required"),
    projectUrl: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
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
    technologies: z
      .array(z.string().trim().min(1, "Technology cannot be empty"))
      .min(1, "At least one technology is required"),
  })
  .refine(
    (data) =>
      !data.endDate || new Date(data.endDate) >= new Date(data.startDate),
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export type UpdateProjectInputDTO = z.infer<typeof UpdateProjectInputSchema>;
