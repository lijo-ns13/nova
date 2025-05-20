// src/modules/job/services/UserInterviewService.ts
import { inject } from "inversify";
import { TYPES } from "../../di/types";

import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { IApplication } from "../../models/application.modal";
import { IUserInterviewService } from "../../interfaces/services/IUserInterviewService";

export class UserInterviewService implements IUserInterviewService {
  constructor(
    @inject(TYPES.ApplicationRepository)
    private _applicationRepo: IApplicationRepository
  ) {}

  async updateStatus(
    applicationId: string,
    status: string
  ): Promise<IApplication | null> {
    return this._applicationRepo.updateStatus(applicationId, status);
  }
}
