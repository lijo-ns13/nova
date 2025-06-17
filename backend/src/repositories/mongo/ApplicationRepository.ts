// src/modules/job/repositories/ApplicationRepository.ts
import { inject, injectable } from "inversify";
import applicationModel, {
  IApplication,
  ApplicationStatus,
} from "../../models/application.modal";
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
    @inject(TYPES.applicationModal) applicationModel: Model<IApplication>
  ) {
    super(applicationModel);
  }

  async create(data: {
    job: string;
    user: string;
    resumeMediaId: string;
  }): Promise<IApplication> {
    try {
      const application = new this.model({
        job: new Types.ObjectId(data.job),
        user: new Types.ObjectId(data.user),
        resumeMediaId: new Types.ObjectId(data.resumeMediaId),
        appliedAt: new Date(),
        status: ApplicationStatus.APPLIED,
        statusHistory: [
          {
            status: ApplicationStatus.APPLIED,
            changedAt: new Date(),
          },
        ],
      });

      await application.save();
      return application;
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new Error("You have already applied for this job.");
      }
      console.error("Error creating application:", error);
      throw new Error(
        (error as Error).message || "Failed to create application"
      );
    }
  }

  /**
   * Reuses BaseRepository's findById and update
   */
  async updateStatus(
    applicationId: string,
    status: ApplicationStatus,
    reason?: string
  ): Promise<IApplication | null> {
    const application = await this.findById(applicationId);
    if (!application) return null;

    // Update fields
    application.status = status;

    // Push to status history
    application.statusHistory.push({
      status,
      changedAt: new Date(),
      ...(reason ? { reason } : {}),
    });

    return application.save();
  }

  async findByJobId(jobId: string): Promise<IApplication[]> {
    return this.findAll({ job: new Types.ObjectId(jobId) });
  }

  async findByUserId(userId: string): Promise<IApplication[]> {
    return this.findAll({ user: new Types.ObjectId(userId) });
  }

  async findByIdWithUserAndJob(
    applicationId: string
  ): Promise<IApplication | null> {
    return this.model
      .findById(applicationId)
      .populate("user", "name username profilePicture")
      .populate("job")
      .exec();
  }

  async findByJobIdAndPop(userId: string): Promise<IApplication[]> {
    return this.model
      .find({ user: userId })
      .populate("job", "title description location jobType")
      .exec();
  }
  async shortlistApplication(applicationId: string): Promise<boolean> {
    const application = await this.findById(applicationId);
    if (!application) return false;

    application.status = ApplicationStatus.SHORTLISTED;
    application.statusHistory.push({
      status: ApplicationStatus.SHORTLISTED,
      changedAt: new Date(),
    });

    await application.save();
    return true;
  }

  async rejectApplication(
    applicationId: string,
    reason?: string
  ): Promise<boolean> {
    const application = await this.findById(applicationId);
    if (!application) return false;

    application.status = ApplicationStatus.REJECTED;
    application.statusHistory.push({
      status: ApplicationStatus.REJECTED,
      changedAt: new Date(),
      reason: reason || "No reason provided",
    });

    await application.save();
    return true;
  }
  async hasUserApplied(jobId: string, userId: string): Promise<boolean> {
    const count = await this.model.countDocuments({
      job: new Types.ObjectId(jobId),
      user: new Types.ObjectId(userId),
    });
    return count > 0;
  }
}
