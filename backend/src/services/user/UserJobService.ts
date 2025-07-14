import { inject } from "inversify";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUserJobService } from "../../interfaces/services/IUserJobService";
import { TYPES } from "../../di/types";
import { IJob } from "../../models/job.modal";
import { IJobRepository } from "../../interfaces/repositories/IJobRepository";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import {
  ApplicationStatus,
  IApplication,
} from "../../models/application.modal";
import { INotificationService } from "../../interfaces/services/INotificationService";
import mongoose, { Types } from "mongoose";
import { NotificationType } from "../../models/notification.modal";
import { GetAllJobsQueryInput } from "../../core/validations/user/user.jobschema";
import { JobResponseDTO, UserJobMapper } from "../../mapping/user/jobmapper";
import { JobMapper } from "../../mapping/job.mapper";
import { IAppliedJob } from "../../repositories/mongo/ApplicationRepository";
export interface AppliedJobDTO {
  _id: string;
  job: {
    _id: string;
    title: string;
    description: string;
    location: string;
    jobType: string;
  };
  appliedAt: string;
  status: ApplicationStatus;
  resumeUrl: string;
  statusHistory: {
    status: ApplicationStatus;
    changedAt: string;
    reason?: string;
  }[];
  rejectionReason?: string;
  scheduledAt?: string;
}

export class UserJobService implements IUserJobService {
  constructor(
    @inject(TYPES.JobRepository)
    private _jobRepository: IJobRepository,
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES.ApplicationRepository)
    private _applicationRepo: IApplicationRepository,
    @inject(TYPES.MediaService)
    private _mediaService: IMediaService,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService
  ) {}

  async getAllJobs(
    query: GetAllJobsQueryInput
  ): Promise<{ jobs: JobResponseDTO[]; total: number; totalPages: number }> {
    const { page, limit, ...rawFilters } = query;

    const filters = this.mapFilters(rawFilters);

    const { jobs, total, totalPages } = await this._jobRepository.getAllJobs(
      page,
      limit,
      filters
    );

    return {
      jobs: jobs.map(UserJobMapper.toJobResponse),
      total,
      totalPages,
    };
  }

  private mapFilters(
    filters: Omit<GetAllJobsQueryInput, "page" | "limit">
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {
      status: "open",
      applicationDeadline: { $gte: new Date() },
    };

    if (filters.title) result.title = { $regex: filters.title, $options: "i" };
    if (filters.location)
      result.location = { $regex: filters.location, $options: "i" };
    if (filters.jobType)
      result.jobType = {
        $in: Array.isArray(filters.jobType)
          ? filters.jobType
          : [filters.jobType],
      };
    if (filters.employmentType)
      result.employmentType = {
        $in: Array.isArray(filters.employmentType)
          ? filters.employmentType
          : [filters.employmentType],
      };
    if (filters.experienceLevel)
      result.experienceLevel = {
        $in: Array.isArray(filters.experienceLevel)
          ? filters.experienceLevel
          : [filters.experienceLevel],
      };
    if (filters.skills)
      result.skillsRequired = {
        $in: Array.isArray(filters.skills) ? filters.skills : [filters.skills],
      };
    if (filters.minSalary) result["salary.min"] = { $gte: filters.minSalary };
    if (filters.maxSalary) result["salary.max"] = { $lte: filters.maxSalary };
    if (filters.company) result.company = filters.company;

    return result;
  }
  async getJob(jobId: string): Promise<JobResponseDTO> {
    const job = await this._jobRepository.getJob(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    return UserJobMapper.toGetJobResponse(job);
  }

  async getAppliedJobs(userId: string): Promise<IAppliedJob[]> {
    const applications = await this._applicationRepo.findAppliedJobs(userId);
    return applications;
  }

  async applyToJob(
    jobId: string,
    userId: string,
    resumeFile: Express.Multer.File
  ): Promise<void> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new Error("user not found");

    const maxFree = parseInt(process.env.FREE_JOB_APPLY_COUNT || "5", 10);
    const hasValidSubscription =
      user.isSubscriptionTaken &&
      user.subscriptionExpiresAt &&
      user.subscriptionExpiresAt > new Date();

    if (!hasValidSubscription && user.appliedJobCount >= maxFree) {
      throw new Error("free tier limit ended");
    }

    const [mediaId] = await this._mediaService.uploadMedia(
      [resumeFile],
      userId,
      "User"
    );

    const application = await this._applicationRepo.CreateApplication({
      jobId: jobId,
      userId: userId,
      resumeMediaId: mediaId,
    });

    if (!application) throw new Error("application not found");

    await this._userRepository.addToAppliedJobs(userId, jobId);
    await this._userRepository.updateUser(userId, {
      appliedJobCount: user.appliedJobCount + 1,
    });

    const job = await this._jobRepository.findById(jobId);
    if (!job) throw new Error("job not found");

    const companyId = job.company;

    await this.notificationService.sendNotification(
      companyId.toString(),
      `${user.name} applied for job ${job.title}`,
      NotificationType.JOB,
      userId
    );
  }

  async hasApplied(jobId: string, userId: string): Promise<boolean> {
    return this._applicationRepo.hasUserApplied(jobId, userId);
  }
}
