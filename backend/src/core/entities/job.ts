// src/core/dtos/company/job.dto.ts
export interface CreateJobDto {
  title: string;
  location: string;
  jobType: string;
  employmentType: string;
  experienceLevel: string;
  description: string;
  benefits: string[];
  applicationDeadline: string; // ISO string
  salary: {
    currency: string;
    min: number;
    max: number;
    isVisibleToApplicants: boolean;
  };
  skillsRequired: string[];
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}
