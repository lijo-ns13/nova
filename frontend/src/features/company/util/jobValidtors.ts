import { z } from "zod";

export const createJobSchema = z.object({
  title: z
    .string()
    .nonempty("Title is required")
    .min(5, { message: "Minimum 5 characters" }),
  description: z
    .string()
    .nonempty("Description is required")
    .min(50, { message: "Minimum 50 characters" }),
  location: z.string().nonempty("Location is required"),
  jobType: z.enum(["remote", "hybrid", "on-site"], {
    message: "Choose a job type",
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
    { message: "Choose an employment type" }
  ),
  experienceLevel: z.enum(["entry", "mid", "senior", "lead"], {
    message: "Choose experience level",
  }),
  skillsRequired: z
    .array(z.string().min(1, { message: "Skill is required" }))
    .min(1, { message: "At least one skill is required" }),
  salary: z
    .object({
      currency: z.string().nonempty("Currency is required"),
      min: z.number().nonnegative(),
      max: z.number().nonnegative(),
      isVisibleToApplicants: z.boolean(),
    })
    .refine((data) => data.max >= data.min, {
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["max"],
    }),
  benefits: z
    .array(z.string().nonempty())
    .min(1, "At least one benefit is required"),
  applicationDeadline: z.coerce.date(),
});
export type CreateJobInput = z.infer<typeof createJobSchema>;
