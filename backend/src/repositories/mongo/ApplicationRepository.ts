// src/modules/job/repositories/ApplicationRepository.ts
import { injectable } from "inversify";
import applicationModal, { IApplication } from "../../models/application.modal";
import { BaseRepository } from "./BaseRepository";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";

@injectable()
export class ApplicationRepository
  extends BaseRepository<IApplication>
  implements IApplicationRepository
{
  constructor() {
    super(applicationModal);
  }

  async updateStatus(
    applicationId: string,
    status: string
  ): Promise<IApplication | null> {
    return this.model
      .findByIdAndUpdate(applicationId, { status }, { new: true })
      .exec();
  }

  async findByJobId(jobId: string): Promise<IApplication[]> {
    return this.model.find({ job: jobId }).exec();
  }

  async findByUserId(userId: string): Promise<IApplication[]> {
    return this.model.find({ user: userId }).exec();
  }
}
