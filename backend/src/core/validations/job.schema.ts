// src/core/validations/job.schema.ts
import { z } from "zod";

const salarySchema = z
  .object({
    currency: z.string().min(1),
    min: z.number().min(0),
    max: z.number(),
    isVisibleToApplicants: z.boolean(),
  })
  .superRefine((val, ctx) => {
    if (val.max < val.min) {
      ctx.addIssue({
        path: ["max"],
        code: z.ZodIssueCode.custom,
        message: "Max salary must be greater than or equal to min salary",
      });
    }
  });

export const createJobSchema = z.object({
  title: z.string().min(5),
  location: z.string(),
  jobType: z.enum(["remote", "hybrid", "on-site"]),
  employmentType: z.enum([
    "full-time",
    "part-time",
    "contract",
    "temporary",
    "internship",
    "freelance",
  ]),
  experienceLevel: z.enum(["entry", "mid", "senior", "lead"]),
  description: z.string().min(50),
  benefits: z.array(z.string()).min(1),
  applicationDeadline: z.string().refine((val) => new Date(val) > new Date(), {
    message: "Deadline must be in the future",
  }),
  salary: salarySchema,
  skillsRequired: z.array(z.string().min(1)), // skill ObjectIds
});

export const updateJobSchema = createJobSchema.partial();
