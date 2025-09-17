// src/core/interfaces/services/ICompanyJobService.ts

import { ApplicantDetailDTO } from "../../core/dtos/company/getApplicant.dto";
import {
  ApplicantSummaryDTO,
  GetApplicationsQuery,
} from "../../core/dtos/company/getapplications.dto";
import {
  CreateJobInput,
  JobResponseDto,
  UpdateJobInput,
} from "../../core/dtos/company/job.dto";

export interface ICompanyJobService {
  createJob(input: CreateJobInput, companyId: string): Promise<JobResponseDto>;
  updateJob(
    jobId: string,
    companyId: string,
    updated: UpdateJobInput
  ): Promise<JobResponseDto | null>;
  deleteJob(jobId: string, companyId: string): Promise<boolean>;
  getJobs(
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ jobs: JobResponseDto[]; total: number }>;
  getJob(jobId: string): Promise<JobResponseDto>;

  // updated
  shortlistApplication(applicationId: string): Promise<boolean>;

  rejectApplication(
    applicationId: string,
    rejectionReason?: string
  ): Promise<boolean>;
  getApplicantDetails(
    applicationId: string
  ): Promise<ApplicantDetailDTO | null>;
  getApplications(
    page: number,
    limit: number,
    filters: GetApplicationsQuery,
    jobId: string
  ): Promise<{
    applications: ApplicantSummaryDTO[];
    pagination: {
      totalApplications: number;
      totalPages: number;
      currentPage: number;
      applicationsPerPage: number;
    };
  }>;
}
