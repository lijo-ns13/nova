// src/modules/job/services/JobService.ts

import { inject } from "inversify";
import {
  CreateJobDto,
  IJobRepository,
  UpdateJobDto,
} from "../../interfaces/repositories/IJobRepository";
import { TYPES } from "../../di/types";
import { IJob } from "../../models/job.modal";
import { ICompanyJobService } from "../../interfaces/services/ICompanyJobService";

export class CompanyJobService implements ICompanyJobService {
  constructor(
    @inject(TYPES.JobRepository)
    private _jobRepository: IJobRepository
  ) {}
  async createJob(
    createJobDto: CreateJobDto,
    companyId: string
  ): Promise<IJob> {
    return await this._jobRepository.createJob(createJobDto, companyId);
  }

  async updateJob(
    jobId: string,
    companyId: string,
    updateJobDto: UpdateJobDto
  ): Promise<IJob | null> {
    return await this._jobRepository.updateJob(jobId, companyId, updateJobDto);
  }

  async deleteJob(jobId: string, companyId: string): Promise<boolean> {
    return await this._jobRepository.deleteJob(jobId, companyId);
  }
  async getJobs(
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ jobs: IJob[]; total: number }> {
    return await this._jobRepository.getJobs(companyId, page, limit);
  }

  async getJobApplications(
    jobId: string,
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ applications: any[]; total: number } | null> {
    return await this._jobRepository.getJobApplications(
      jobId,
      companyId,
      page,
      limit
    );
  }
  async getJob(jobId: string) {
    return await this._jobRepository.getJob(jobId);
  }
  async getApplications(
    page: number = 1,
    limit: number = 10,
    filters: Record<string, any> = {},
    jobId: string
  ) {
    const { applications, total } =
      await this._jobRepository.findApplicationsByFilter(
        filters,
        page,
        limit,
        jobId
      );

    const totalPages = Math.ceil(total / limit);

    return {
      applications,
      pagination: {
        totalApplications: total,
        totalPages,
        currentPage: page,
        applicationsPerPage: limit,
      },
    };
  }
}
