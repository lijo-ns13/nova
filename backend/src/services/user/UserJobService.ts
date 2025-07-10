import { inject } from "inversify";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUserJobService } from "../../interfaces/services/IUserJobService";
import { TYPES } from "../../di/types";
import { IJob } from "../../models/job.modal";
import { IJobRepository } from "../../interfaces/repositories/IJobRepository";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { IApplication } from "../../models/application.modal";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { Types } from "mongoose";
import { NotificationType } from "../../models/notification.modal";
import { GetAllJobsQueryInput } from "../../core/validations/user/user.jobschema";
import { JobResponseDTO, UserJobMapper } from "../../mapping/user/jobmapper";

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
  async getAppliedJobs(userId: string): Promise<any> {
    const application = await this._applicationRepo.findAll({ user: userId });
  }

  async getJob(jobId: string) {
    return this._jobRepository.getJob(jobId);
  }
  async applyToJob(
    jobId: string,
    userId: string,
    resumeFile: Express.Multer.File
  ): Promise<IApplication> {
    try {
      // Validate file type again (redundant but safe)
      if (resumeFile.mimetype !== "application/pdf") {
        throw new Error("Only PDF files are allowed for resumes");
      }
      const user = await this._userRepository.findById(userId);
      const maxFreeJobApplyCount = parseInt(
        process.env.FREE_JOB_APPLY_COUNT ?? "5",
        10
      );
      if (!user) {
        throw new Error("User not found");
      }

      const hasValidSubscription =
        user.isSubscriptionTaken &&
        user.subscriptionExpiresAt &&
        user.subscriptionExpiresAt > new Date();

      if (
        !hasValidSubscription &&
        user.appliedJobCount >= maxFreeJobApplyCount
      ) {
        throw new Error(
          "Please take a subscription. Your free access has ended."
        );
      }

      // Upload resume to S3
      const [mediaId] = await this._mediaService.uploadMedia(
        [resumeFile],
        userId,
        "User"
      );

      // Create application record
      const application = await this._applicationRepo.create({
        job: jobId,
        user: userId,
        resumeMediaId: mediaId,
      });
      if (!application) {
        throw new Error("appliction can't creat");
      }
      // Add to user's applied jobs
      await this._userRepository.addToAppliedJobs(userId, jobId);
      await this._userRepository.updateUser(userId, {
        appliedJobCount: user.appliedJobCount + 1,
      });
      // add notification
      const job = await this._jobRepository.findById(jobId);
      if (!job) {
        throw new Error("job not found");
      }
      const companyId =
        typeof job.company === "string"
          ? job.company
          : job.company instanceof Types.ObjectId
          ? job.company.toString()
          : job.company._id?.toString(); // when populated

      await this.notificationService.sendNotification(
        companyId.toString(),
        `${user.name} applied job ${job.title} `,
        NotificationType.JOB,
        userId
      );
      return application;
    } catch (error) {
      console.error("Error in applyToJob service:", error);
      throw new Error(`Failed to apply to job: ${(error as Error).message}`);
    }
  }

  async hasApplied(jobId: string, userId: string): Promise<boolean> {
    return this._applicationRepo.hasUserApplied(jobId, userId);
  }
}
