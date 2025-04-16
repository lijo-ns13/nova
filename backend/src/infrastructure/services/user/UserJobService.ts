import { inject } from "inversify";
import { IUserRepository } from "../../../core/interfaces/repositories/IUserRepository";
import { IUserJobService } from "../../../core/interfaces/services/IUserJobService";
import { TYPES } from "../../../di/types";
import { IJob } from "../../database/models/job.modal";
import { IJobRepository } from "../../../core/interfaces/repositories/IJobRepository";

export class UserJobService implements IUserJobService {
  constructor(
    @inject(TYPES.JobRepository)
    private jobRepository: IJobRepository,
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository
  ) {}

  async getAllJobs(): Promise<IJob[]> {
    return this.jobRepository.getAllJobs();
  }
  async getJob(jobId: string) {
    return this.jobRepository.getJob(jobId);
  }
  async applyToJob(
    jobId: string,
    userId: string,
    resumeUrl: string
  ): Promise<IJob> {
    const job = await this.jobRepository.applyToJob(jobId, userId, resumeUrl);
    await this.userRepository.addToAppliedJobs(userId, jobId);
    return job;
  }
  async getSavedJobs(userId: string): Promise<IJob[]> {
    const user = await this.userRepository.getSavedJobs(userId);
    return user?.savedJobs || [];
  }

  async getAppliedJobs(userId: string): Promise<IJob[]> {
    const user = await this.userRepository.getAppliedJobs(userId);
    return user?.appliedJobs || [];
  }

  async addToSavedJobs(userId: string, jobId: string): Promise<void> {
    await this.userRepository.addToSavedJobs(userId, jobId);
  }

  async removeFromSavedJobs(userId: string, jobId: string): Promise<void> {
    await this.userRepository.removeFromSavedJobs(userId, jobId);
  }
}
