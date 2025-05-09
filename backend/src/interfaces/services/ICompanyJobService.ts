// src/core/interfaces/services/ICompanyJobService.ts

import { IJob, JobApplication } from "../../models/job.modal";
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
  ): Promise<{ applications: JobApplication[]; total: number } | null>;

  getJob(jobId: string): Promise<IJob | null>;
}
