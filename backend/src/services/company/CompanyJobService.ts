// src/modules/job/services/JobService.ts

import { inject } from "inversify";
import {
  CreateJobDto,
  IJobRepository,
  UpdateJobDto,
} from "../../interfaces/repositories/IJobRepository";
import { TYPES } from "../../di/types";
import { ApplicationStatus, IJob } from "../../models/job.modal";
import { ICompanyJobService } from "../../interfaces/services/ICompanyJobService";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import applicationModal from "../../models/application.modal";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";

export class CompanyJobService implements ICompanyJobService {
  constructor(
    @inject(TYPES.JobRepository)
    private _jobRepository: IJobRepository,
    @inject(TYPES.MediaService) private _mediaService: IMediaService,
    @inject(TYPES.ApplicationRepository)
    private _applicationRepo: IApplicationRepository
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
  async shortlistApplication(applicationId: string): Promise<boolean> {
    return await this._applicationRepo.shortlistApplication(applicationId);
  }

  async rejectApplication(
    applicationId: string,
    reason?: string
  ): Promise<boolean> {
    return await this._applicationRepo.rejectApplication(applicationId, reason);
  }

  async getApplicantDetails(applicationId: string): Promise<any> {
    try {
      const applicant = await this._jobRepository.getApplicantDetails(
        applicationId
      );

      if (!applicant) {
        return null;
      }

      // If there's a resume media document
      if (applicant.resumeMediaId) {
        // Get signed URL for the resume
        const resumeUrl = await this._mediaService.getMediaUrl(
          applicant.resumeMediaId.s3Key
        );

        // Create a new object with the signed URL
        return {
          ...applicant.toObject(),
          resumeUrl,
        };
      }

      return applicant;
    } catch (error) {
      console.error("Error get application:", error);
      throw new Error("Failed to get application");
    }
  }
}
