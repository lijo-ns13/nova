import { inject } from "inversify";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUserJobService } from "../../interfaces/services/IUserJobService";
import { TYPES } from "../../di/types";
import { IJob } from "../../models/job.modal";
import { IJobRepository } from "../../interfaces/repositories/IJobRepository";

export class UserJobService implements IUserJobService {
  constructor(
    @inject(TYPES.JobRepository)
    private _jobRepository: IJobRepository,
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository
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
    resumeUrl: string
  ): Promise<IJob> {
    const job = await this._jobRepository.applyToJob(jobId, userId, resumeUrl);
    await this._userRepository.addToAppliedJobs(userId, jobId);
    return job;
  }
  async getSavedJobs(userId: string): Promise<IJob[]> {
    if (!userId) throw new Error("user id not found");
    console.log("userId in getSavedJob ->service", userId);
    const user = await this._userRepository.getSavedJobs(userId);
    if (!user) throw new Error("REpository realted error");
    console.log("getSavedJobs in Service", user?.savedJobs);
    return user?.savedJobs;
  }

  async getAppliedJobs(userId: string): Promise<IJob[]> {
    const user = await this._userRepository.getAppliedJobs(userId);
    console.log("getApplidJobs in Service", user?.appliedJobs);
    return user?.appliedJobs || [];
  }

  async addToSavedJobs(userId: string, jobId: string): Promise<void> {
    await this._userRepository.addToSavedJobs(userId, jobId);
  }

  async removeFromSavedJobs(userId: string, jobId: string): Promise<void> {
    await this._userRepository.removeFromSavedJobs(userId, jobId);
  }
}
