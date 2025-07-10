// src/validators/job/jobQuerySchema.ts
import { z } from "zod";

export const jobQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  jobType: z.string().optional(),
  employmentType: z.string().optional(),
  experienceLevel: z.string().optional(),
  skills: z.union([z.string(), z.array(z.string())]).optional(),
  minSalary: z.string().optional(),
  maxSalary: z.string().optional(),
  company: z.string().optional(),
});
