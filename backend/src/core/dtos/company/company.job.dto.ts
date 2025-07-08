import { z } from "zod";
import { EmploymentType, JobType, ExperienceLevel } from "../../enums/job.enum";

export const salarySchema = z
  .object({
    currency: z.string().min(1),
    min: z.number().min(0),
    max: z.number().min(0),
    isVisibleToApplicants: z.boolean().default(true),
  })
  .refine((data) => data.max >= data.min, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["max"],
  });

export const createJobSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(50).max(5000),
  location: z.string().max(100),
  jobType: z.nativeEnum(JobType),
  employmentType: z.nativeEnum(EmploymentType),
  experienceLevel: z.nativeEnum(ExperienceLevel),
  salary: salarySchema,
  benefits: z.string().array().min(1),
  perks: z.string().array().optional(),
  skillsRequired: z.string().array().min(1),
  applicationDeadline: z.coerce.date().refine((date) => date > new Date(), {
    message: "Application deadline must be in the future",
  }),
});

export const updateJobSchema = createJobSchema.partial();

export type CreateJobDto = z.infer<typeof createJobSchema>;
export type UpdateJobDto = z.infer<typeof updateJobSchema>;
