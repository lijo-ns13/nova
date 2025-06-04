// src/modules/job/services/UserInterviewService.ts
import { inject } from "inversify";
import { TYPES } from "../../di/types";

import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import {
  ApplicationStatus,
  IApplication,
} from "../../models/application.modal";
import { IUserInterviewService } from "../../interfaces/services/IUserInterviewService";
import { IInterviewRepository } from "../../interfaces/repositories/IInterviewRepository";
import { IInterview } from "../../core/entities/interview.interface";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { NotificationType } from "../../models/notification.modal";
import { IJobRepository } from "../../interfaces/repositories/IJobRepository";
import { Types } from "mongoose";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";

export class UserInterviewService implements IUserInterviewService {
  constructor(
    @inject(TYPES.ApplicationRepository)
    private _applicationRepo: IApplicationRepository,
    @inject(TYPES.InterviewRepository)
    private _interviewRepo: IInterviewRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService,
    @inject(TYPES.JobRepository) private _jobRepo: IJobRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}
  async findInterview(applicationId: string, userId: string): Promise<any> {
    return this._interviewRepo.findOne({ applicationId, userId });
  }
  async updateStatus(
    applicationId: string,
    status: ApplicationStatus
  ): Promise<IApplication | null> {
    const application = await this._applicationRepo.findById(applicationId);
    if (!application) {
      throw new Error("Application not found");
    }
    const userId =
      typeof application.user === "string"
        ? application.user
        : application.user instanceof Types.ObjectId
        ? application.user.toString()
        : application.user._id?.toString(); // when populated

    if (!userId) {
      throw new Error("userId not found");
    }
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    const { name, _id } = user;
    const jobId =
      typeof application.job === "string"
        ? application.job
        : application.job instanceof Types.ObjectId
        ? application.job.toString()
        : application.job._id?.toString(); // when populated

    if (!jobId) {
      throw new Error("jobId not found");
    }
    const job = await this._jobRepo.findById(jobId);
    const companyId = job?.company;
    if (!companyId) {
      throw new Error("companyId not found");
    }
    await this.notificationService.sendNotification(
      companyId.toString(),
      `${name} has responded to the interview with status: ${status
        .replaceAll("_", " ")
        .toLowerCase()}`,
      NotificationType.JOB,
      _id
    );
    return this._applicationRepo.updateStatus(applicationId, status);
  }
}
