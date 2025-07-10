// src/validators/job/userJobFilterSchema.ts
import { z } from "zod";

export const GetAllJobsQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(10),
  title: z.string().trim().optional(),
  location: z.string().trim().optional(),
  jobType: z.string().optional(),
  employmentType: z.string().optional(),
  experienceLevel: z.string().optional(),
  skills: z.union([z.string(), z.array(z.string())]).optional(),
  minSalary: z.coerce.number().optional(),
  maxSalary: z.coerce.number().optional(),
  company: z.string().optional(),
});

export const GetAppliedJobsQuerySchema = z.object({
  page: z.string().transform(Number).optional().default("1"),
  limit: z.string().transform(Number).optional().default("10"),
});

export type GetAppliedJobsQueryInput = z.infer<
  typeof GetAppliedJobsQuerySchema
>;
export type GetAllJobsQueryInput = z.infer<typeof GetAllJobsQuerySchema>;
