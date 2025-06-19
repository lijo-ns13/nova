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
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { Types } from "mongoose";
import { NotificationType } from "../../models/notification.modal";

export class CompanyJobService implements ICompanyJobService {
  constructor(
    @inject(TYPES.JobRepository)
    private _jobRepository: IJobRepository,
    @inject(TYPES.MediaService) private _mediaService: IMediaService,
    @inject(TYPES.ApplicationRepository)
    private _applicationRepo: IApplicationRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
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
    const applicant = await this._applicationRepo.findById(applicationId);
    if (!applicant) {
      throw new Error("application not found");
    }
    const jobId =
      typeof applicant.job === "string"
        ? applicant.job
        : applicant.job instanceof Types.ObjectId
        ? applicant.job.toString()
        : applicant.job._id?.toString(); // when populated
    if (!jobId) {
      throw new Error("jobid not found");
    }
    const jobData = await this._jobRepository.findById(jobId);
    const jobTitle = jobData?.title || "position";
    const companyId = jobData?.company;
    const userId =
      typeof applicant.user === "string"
        ? applicant.user
        : applicant.user instanceof Types.ObjectId
        ? applicant.user.toString()
        : applicant.user._id?.toString(); // when populated

    if (!userId) {
      throw new Error("user id not found");
    }
    const userData = await this._userRepo.findById(userId);
    const message = `Congratulations! Your application for the position "${jobTitle}" has been shortlisted. We will contact you with the next steps.`;

    await this._notificationService.sendNotification(
      userId,
      message,
      NotificationType.JOB,
      companyId
    );
    return await this._applicationRepo.shortlistApplication(applicationId);
  }

  async rejectApplication(
    applicationId: string,
    reason?: string
  ): Promise<boolean> {
    const applicant = await this._applicationRepo.findById(applicationId);
    if (!applicant) {
      throw new Error("application not found");
    }
    const jobId =
      typeof applicant.job === "string"
        ? applicant.job
        : applicant.job instanceof Types.ObjectId
        ? applicant.job.toString()
        : applicant.job._id?.toString(); // when populated
    if (!jobId) {
      throw new Error("jobid not found");
    }
    const jobData = await this._jobRepository.findById(jobId);
    const jobTitle = jobData?.title;
    const companyId = jobData?.company;
    const userId =
      typeof applicant.user === "string"
        ? applicant.user
        : applicant.user instanceof Types.ObjectId
        ? applicant.user.toString()
        : applicant.user._id?.toString(); // when populated

    if (!userId) {
      throw new Error("user id not found");
    }
    const userData = await this._userRepo.findById(userId);
    await this._notificationService.sendNotification(
      userId,
      `Your application for the position "${jobTitle}" has been rejected.${
        reason ? ` Reason: ${reason}.` : ""
      }`,
      NotificationType.JOB,
      companyId
    );
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
