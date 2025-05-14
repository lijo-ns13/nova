// src/core/interfaces/services/ICompanyJobService.ts

import { IJob } from "../../models/job.modal";
import { CreateJobDto, UpdateJobDto } from "../repositories/IJobRepository";

export interface ICompanyJobService {
  createJob(createJobDto: CreateJobDto, companyId: string): Promise<IJob>;

  updateJob(
    jobId: string,
    companyId: string,
    updateJobDto: UpdateJobDto
  ): Promise<IJob | null>;

  deleteJob(jobId: string, companyId: string): Promise<boolean>;

  getJobs(
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ jobs: IJob[]; total: number }>;

  getJobApplications(
    jobId: string,
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ applications: any[]; total: number } | null>;

  getJob(jobId: string): Promise<IJob | null>;
  getApplications(
    page: number,
    limit: number,
    filters: Record<string, any>,
    jobId: string
  ): Promise<any>;
  // updated
  shortlistApplication(applicationId: string): Promise<boolean>;

  rejectApplication(
    applicationId: string,
    rejectionReason?: string
  ): Promise<boolean>;
  getApplicantDetails(applicationId: string): Promise<any>;
}
