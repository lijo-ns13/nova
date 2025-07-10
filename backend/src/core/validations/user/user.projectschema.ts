import { z } from "zod";

export const CreateProjectInputSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  projectUrl: z.string().url().optional(),
  startDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid startDate" }),
  endDate: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid endDate",
    })
    .optional(),
  technologies: z.array(z.string()).min(1),
});

export const UpdateProjectInputSchema = CreateProjectInputSchema.partial();
export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
});
