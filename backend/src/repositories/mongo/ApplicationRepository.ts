// src/modules/job/repositories/ApplicationRepository.ts
import { inject, injectable } from "inversify";
import applicationModal, { IApplication } from "../../models/application.modal";
import { BaseRepository } from "./BaseRepository";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { Model, Types } from "mongoose";
import { TYPES } from "../../di/types";
import { MongoServerError } from "mongodb";
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
  async create(data: {
    job: string;
    user: string;
    resumeMediaId: string;
  }): Promise<IApplication> {
    try {
      const application = new applicationModal({
        job: new Types.ObjectId(data.job),
        user: new Types.ObjectId(data.user),
        resumeMediaId: new Types.ObjectId(data.resumeMediaId),
        // status: "applied",
        appliedAt: new Date(),
      });

      await application.save();
      return application;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        // Optional: customize message by inspecting `error.keyPattern`
        throw new Error("You have already applied for this job.");
      }
      console.error("Error creating application:", error);
      throw new Error(
        (error as Error).message || "Failed to create application"
      );
    }
  }
  async updateStatus(
    applicationId: string,
    status: string,
    scheduledAt?: Date
  ): Promise<IApplication | null> {
    return this.model
      .findByIdAndUpdate(applicationId, { status, scheduledAt }, { new: true })
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
