// src/modules/job/repositories/ApplicationRepository.ts
import { inject, injectable } from "inversify";
import applicationModal, { IApplication } from "../../models/application.modal";
import { BaseRepository } from "./BaseRepository";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { Model } from "mongoose";
import { TYPES } from "../../di/types";

@injectable()
export class ApplicationRepository
  extends BaseRepository<IApplication>
  implements IApplicationRepository
{
  constructor(
    @inject(TYPES.applicationModal) applicationModal: Model<IApplication>
  ) {
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
  async findByIdWithUserAndJob(
    applicationId: string
  ): Promise<IApplication | null> {
    return this.model
      .findById(applicationId)
      .populate("user", "name username profilePicture") // select specific fields
      .populate("job") // optional
      .exec();
  }
  async findByJobIdAndPop(userId: string): Promise<any> {
    return this.model
      .find({ user: userId })
      .populate("job", "title description location jobType")
      .exec();
  }
}
