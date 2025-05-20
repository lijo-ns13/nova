// src/modules/job/services/UserInterviewService.ts
import { inject } from "inversify";
import { TYPES } from "../../di/types";

import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { IApplication } from "../../models/application.modal";
import { IUserInterviewService } from "../../interfaces/services/IUserInterviewService";
import { IInterviewRepository } from "../../interfaces/repositories/IInterviewRepository";
import { IInterview } from "../../core/entities/interview.interface";

export class UserInterviewService implements IUserInterviewService {
  constructor(
    @inject(TYPES.ApplicationRepository)
    private _applicationRepo: IApplicationRepository,
    @inject(TYPES.InterviewRepository)
    private _interviewRepo: IInterviewRepository
  ) {}
  async findInterview(applicationId: string, userId: string): Promise<any> {
    return this._interviewRepo.findOne({ applicationId, userId });
  }
  async updateStatus(
    applicationId: string,
    status: string
  ): Promise<IApplication | null> {
    return this._applicationRepo.updateStatus(applicationId, status);
  }
}
