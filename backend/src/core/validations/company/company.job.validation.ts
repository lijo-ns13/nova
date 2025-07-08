// src/modules/job/validations/job.validation.ts

import { z } from "zod";
import mongoose from "mongoose";

// Validate ObjectId
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

// Shared fields for both create/update
const baseJobSchema = {
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters long"),
  location: z.string().min(1, "Location is required"),
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
  skillsRequired: z
    .array(objectIdSchema)
    .min(1, "At least one skill is required"),
  salary: z
    .object({
      currency: z.string().min(1, "Currency is required"),
      min: z.number().nonnegative("Minimum salary must be ≥ 0"),
      max: z.number().nonnegative("Maximum salary must be ≥ 0"),
      isVisibleToApplicants: z.boolean(),
    })
    .refine((data) => data.max >= data.min, {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["max"],
    }),
  benefits: z.array(z.string()).min(1, "At least one benefit is required"),
  perks: z.array(z.string()).optional(),
  applicationDeadline: z.coerce.date().refine((d) => d > new Date(), {
    message: "Application deadline must be a future date",
  }),
};

// ✅ Create Job Schema (all required)
export const createJobSchema = z.object({
  ...baseJobSchema,
});

// ✅ Update Job Schema (all optional, but still validated if provided)
export const updateJobSchema = z.object({
  ...Object.fromEntries(
    Object.entries(baseJobSchema).map(([key, value]) => [key, value.optional()])
  ),
});
