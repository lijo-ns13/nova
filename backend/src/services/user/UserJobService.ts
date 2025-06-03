import { inject } from "inversify";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUserJobService } from "../../interfaces/services/IUserJobService";
import { TYPES } from "../../di/types";
import { IJob } from "../../models/job.modal";
import { IJobRepository } from "../../interfaces/repositories/IJobRepository";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { IApplication } from "../../models/application.modal";
const maxFreeJobApplyCount = parseInt(
  process.env.FREE_JOB_APPLY_COUNT ?? "5",
  10
);
export class UserJobService implements IUserJobService {
  constructor(
    @inject(TYPES.JobRepository)
    private _jobRepository: IJobRepository,
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES.ApplicationRepository)
    private _applicationRepo: IApplicationRepository,
    @inject(TYPES.MediaService)
    private _mediaService: IMediaService
  ) {}

  async getAllJobs(
    page: number = 1,
    limit: number = 10,
    filters: Record<string, any> = {}
  ): Promise<{ jobs: IJob[]; total: number; totalPages: number }> {
    return this._jobRepository.getAllJobs(page, limit, filters);
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
      return application;
    } catch (error) {
      console.error("Error in applyToJob service:", error);
      throw new Error(`Failed to apply to job: ${(error as Error).message}`);
    }
  }
  async getSavedJobs(userId: string): Promise<IJob[]> {
    if (!userId) throw new Error("user id not found");
    console.log("userId in getSavedJob ->service", userId);
    const user = await this._userRepository.getSavedJobs(userId);
    if (!user) throw new Error("REpository realted error");
    console.log("getSavedJobs in Service", user?.savedJobs);
    return user?.savedJobs;
  }

  async getAppliedJobs(userId: string): Promise<any> {
    const appliedJobs = await this._applicationRepo.findByJobIdAndPop(userId);
    return appliedJobs;
  }

  async addToSavedJobs(userId: string, jobId: string): Promise<void> {
    await this._userRepository.addToSavedJobs(userId, jobId);
  }

  async removeFromSavedJobs(userId: string, jobId: string): Promise<void> {
    await this._userRepository.removeFromSavedJobs(userId, jobId);
  }
}
