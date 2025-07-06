import { z } from "zod";

export const createJobSchema = z.object({
  title: z
    .string({ required_error: "Job title is required" })
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must not exceed 100 characters" }),

  description: z
    .string({ required_error: "Job description is required" })
    .min(50, { message: "Description must be at least 50 characters" })
    .max(5000, { message: "Description must not exceed 5000 characters" }),

  location: z
    .string({ required_error: "Location is required" })
    .max(100, { message: "Location must not exceed 100 characters" }),

  jobType: z.enum(["remote", "hybrid", "on-site"], {
    required_error: "Job type is required",
    invalid_type_error: "Job type must be remote, hybrid, or on-site",
  }),

  employmentType: z.enum(
    [
      "full-time",
      "part-time",
      "contract",
      "temporary",
      "internship",
      "freelance",
    ],
    {
      required_error: "Employment type is required",
      invalid_type_error:
        "Employment type must be one of full-time, part-time, contract, temporary, internship, or freelance",
    }
  ),

  experienceLevel: z.enum(["entry", "mid", "senior", "lead"], {
    required_error: "Experience level is required",
    invalid_type_error:
      "Experience level must be one of entry, mid, senior, or lead",
  }),

  salary: z.object({
    currency: z.string({ required_error: "Currency is required" }),
    min: z
      .number({ required_error: "Minimum salary is required" })
      .nonnegative({ message: "Minimum salary cannot be negative" }),
    max: z
      .number({ required_error: "Maximum salary is required" })
      .nonnegative({ message: "Maximum salary cannot be negative" }),
    isVisibleToApplicants: z.boolean({
      required_error: "isVisibleToApplicants must be provided",
    }),
  }),

  benefits: z
    .array(z.string())
    .min(1, { message: "At least one benefit is required" }),

  perks: z.array(z.string()).optional(),

  applicationDeadline: z.coerce
    .date({ required_error: "Application deadline is required" })
    .refine((date) => date > new Date(), {
      message: "Application deadline must be in the future",
    }),

  skillsRequired: z
    .array(z.string(), {
      required_error: "Skills required field is required",
    })
    .min(1, { message: "At least one skill is required" }),
});

export type CreateJobRequest = z.infer<typeof createJobSchema>;
