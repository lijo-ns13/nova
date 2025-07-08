// src/modules/job/dtos/job.dto.ts

import { z } from "zod";
import {
  createJobSchema,
  updateJobSchema,
} from "../../validations/company/company.job.validation";

import { EmploymentType, ExperienceLevel, JobType } from "../../enums/job.enum";

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;

export interface JobResponseDto {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: JobType; // ✅ strict enum
  employmentType: EmploymentType; // ✅ strict enum
  experienceLevel: ExperienceLevel; // ✅ strict enum
  salary: {
    currency: string;
    min: number;
    max: number;
    isVisibleToApplicants: boolean;
  };
  benefits: string[];
  perks?: string[];
  skillsRequired: string[]; // ✅ title only
  applicationDeadline: Date;
  status: "open" | "closed" | "filled"; // ✅ restrict to valid values
  createdAt: Date;
  updatedAt: Date;
}
