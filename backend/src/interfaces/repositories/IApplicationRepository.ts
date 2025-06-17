// src/interfaces/repositories/IApplicationRepository.ts
import { IBaseRepository } from "./IBaseRepository";
import {
  IApplication,
  ApplicationStatus,
} from "../../models/application.modal";

export interface IApplicationRepository extends IBaseRepository<IApplication> {
  updateStatus(
    applicationId: string,
    status: ApplicationStatus,
    reason?: string,
    scheduledAt?: Date
  ): Promise<IApplication | null>;

  findByJobId(jobId: string): Promise<IApplication[]>;

  findByUserId(userId: string): Promise<IApplication[]>;

  findByIdWithUserAndJob(applicationId: string): Promise<IApplication | null>;

  findByJobIdAndPop(userId: string): Promise<IApplication[]>;

  create(data: {
    job: string;
    user: string;
    resumeMediaId: string;
  }): Promise<IApplication>;
  rejectApplication(applicationId: string, reason?: string): Promise<boolean>;
  shortlistApplication(applicationId: string): Promise<boolean>;
  hasUserApplied(jobId: string, userId: string): Promise<boolean>;
}
