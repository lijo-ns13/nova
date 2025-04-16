// src/modules/job/services/JobService.ts

import { inject } from "inversify";
import {
  CreateJobDto,
  IJobRepository,
  UpdateJobDto,
} from "../../../core/interfaces/repositories/IJobRepository";
import { TYPES } from "../../../di/types";
import { IJob, JobApplication } from "../../database/models/job.modal";
import { ICompanyJobService } from "../../../core/interfaces/services/ICompanyJobService";

export class CompanyJobService implements ICompanyJobService {
  constructor(
    @inject(TYPES.JobRepository)
    private jobRepository: IJobRepository
  ) {}
  async createJob(
    createJobDto: CreateJobDto,
    companyId: string
  ): Promise<IJob> {
    return await this.jobRepository.createJob(createJobDto, companyId);
  }

  async updateJob(
    jobId: string,
    companyId: string,
    updateJobDto: UpdateJobDto
  ): Promise<IJob | null> {
    return await this.jobRepository.updateJob(jobId, companyId, updateJobDto);
  }

  async deleteJob(jobId: string, companyId: string): Promise<boolean> {
    return await this.jobRepository.deleteJob(jobId, companyId);
  }
  async getJobs(
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ jobs: IJob[]; total: number }> {
    return await this.jobRepository.getJobs(companyId, page, limit);
  }

  async getJobApplications(
    jobId: string,
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ applications: JobApplication[]; total: number } | null> {
    return await this.jobRepository.getJobApplications(
      jobId,
      companyId,
      page,
      limit
    );
  }
  async getJob(jobId: string) {
    return await this.jobRepository.getJob(jobId);
  }
}
