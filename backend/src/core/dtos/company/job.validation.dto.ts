// src/modules/job/validations/job.validation.ts

import mongoose from "mongoose";
import { z } from "zod";
const objectIdSchema = z
  .string()
  .min(1, "Skill is required")
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid skill ObjectId",
  });

export const createJobSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(50),
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
  skillsRequired: z.array(objectIdSchema),
  salary: z
    .object({
      currency: z.string(),
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
      isVisibleToApplicants: z.boolean(),
    })
    .refine((data) => data.max >= data.min, {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["max"],
    }),
  benefits: z.array(z.string()).min(1, "At least one benefit is required"),
  perks: z.array(z.string()).optional(),
  applicationDeadline: z.coerce.date(),
});

export const updateJobSchema = createJobSchema.partial();
