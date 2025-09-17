import { inject, injectable } from "inversify";
import { BaseRepository } from "./BaseRepository";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import mongoose, { Model, PipelineStage, Types } from "mongoose";
import { TYPES } from "../../di/types";
import { MongoServerError } from "mongodb";
import {
  ApplicantRawData,
  GetApplicationsQuery,
} from "../../core/dtos/company/getapplications.dto";
import { PopulatedApplication } from "../../mapping/company/applicant/aplicationtwo.mapper";
import {
  IApplicationPopulatedJob,
  IApplicationPopulatedUserAndJob,
} from "../entities/applicationPopulated.entity";
import { ApplicationStatus } from "../../core/enums/applicationStatus";
import { IApplication, IStatusHistory } from "../entities/application.entity";
import { IJob } from "../entities/job.entity";
import jobModel from "../models/job.model";
import applicationModel from "../models/application.model";
import {
  ApplicationStatusCount,
  DailyTrend,
  MonthlyTrend,
  WeeklyTrend,
} from "../../core/entities/dashbaord.interface";
export interface ApplyToJobInput {
  jobId: string;
  userId: string;
  resumeMediaId: string;
}
export type IAppliedJob = {
  _id: Types.ObjectId;
  job: Pick<IJob, "_id" | "title" | "description" | "location" | "jobType">;
  appliedAt: Date;
  status: ApplicationStatus;
  resumeMediaId: Types.ObjectId;
  statusHistory: IStatusHistory[];
  scheduledAt?: Date;
  coverLetter?: string;
  notes?: string;
};

@injectable()
export class ApplicationRepository
  extends BaseRepository<IApplication>
  implements IApplicationRepository
{
  constructor(
    @inject(TYPES.applicationModel) applicationModel: Model<IApplication>
  ) {
    super(applicationModel);
  }
  async countApplications(jobIds: string[]): Promise<number> {
    const ids = jobIds.map((id) => new Types.ObjectId(id));
    return this.model.countDocuments({ job: { $in: ids } });
  }

  async countApplicationsSince(jobIds: string[], date: Date): Promise<number> {
    const ids = jobIds.map((id) => new Types.ObjectId(id));
    return this.model.countDocuments({
      job: { $in: ids },
      appliedAt: { $gte: date },
    });
  }

  async aggregateStatusCounts(
    jobIds: string[]
  ): Promise<ApplicationStatusCount[]> {
    const ids = jobIds.map((id) => new Types.ObjectId(id));
    return this.model.aggregate([
      { $match: { job: { $in: ids } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async aggregateDailyTrend(
    jobIds: string[],
    fromDate: Date
  ): Promise<DailyTrend[]> {
    const ids = jobIds.map((id) => new Types.ObjectId(id));
    return this.model.aggregate([
      {
        $match: {
          job: { $in: ids },
          appliedAt: { $gte: fromDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$appliedAt" },
            month: { $month: "$appliedAt" },
            day: { $dayOfMonth: "$appliedAt" },
          },
          count: { $sum: 1 },
          statuses: { $push: "$status" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          count: 1,
          statuses: 1,
          _id: 0,
        },
      },
    ]);
  }

  async aggregateWeeklyTrend(
    jobIds: string[],
    fromDate: Date
  ): Promise<WeeklyTrend[]> {
    const ids = jobIds.map((id) => new Types.ObjectId(id));
    return this.model.aggregate([
      {
        $match: {
          job: { $in: ids },
          appliedAt: { $gte: fromDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: "$appliedAt" },
            week: { $isoWeek: "$appliedAt" },
          },
          count: { $sum: 1 },
          statuses: { $push: "$status" },
        },
      },
      { $sort: { "_id.year": 1, "_id.week": 1 } },
      {
        $project: {
          weekStart: {
            $dateFromParts: {
              isoWeekYear: "$_id.year",
              isoWeek: "$_id.week",
              isoDayOfWeek: 1,
            },
          },
          count: 1,
          statuses: 1,
          _id: 0,
        },
      },
      { $limit: 12 },
    ]);
  }

  async aggregateMonthlyTrend(
    jobIds: string[],
    fromDate: Date
  ): Promise<MonthlyTrend[]> {
    const ids = jobIds.map((id) => new Types.ObjectId(id));
    return this.model.aggregate([
      {
        $match: {
          job: { $in: ids },
          appliedAt: { $gte: fromDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$appliedAt" },
            month: { $month: "$appliedAt" },
          },
          count: { $sum: 1 },
          statuses: { $push: "$status" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          monthStart: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: 1,
            },
          },
          count: 1,
          statuses: 1,
          _id: 0,
        },
      },
      { $limit: 12 },
    ]);
  }
  async findAppliedJobs(userId: string): Promise<IApplicationPopulatedJob[]> {
    const objectId = new Types.ObjectId(userId);
    return this.model
      .find({ user: objectId })
      .populate("job", "_id title description location jobType")
      .lean<IApplicationPopulatedJob[]>()
      .exec();
  }
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
  async findApplicationsByFilter(
    filter: GetApplicationsQuery,
    page: number,
    limit: number,
    jobId: string
  ): Promise<{ applications: ApplicantRawData[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: Record<string, unknown> = {};

    if (jobId) {
      query.job = new mongoose.Types.ObjectId(jobId);
      if (filter.companyId) {
        const exists = await jobModel.exists({
          _id: jobId,
          company: filter.companyId,
        });
        if (!exists) return { applications: [], total: 0 };
      }
    }

    if (filter.status && filter.status !== "") {
      query.status = {
        $in: Array.isArray(filter.status) ? filter.status : [filter.status],
      };
    }

    // Date filter (use full day UTC boundaries)
    if (filter.dateFrom || filter.dateTo) {
      const appliedAt: { $gte?: Date; $lte?: Date } = {};

      if (filter.dateFrom) {
        appliedAt.$gte = new Date(`${filter.dateFrom}T00:00:00.000Z`);
      }

      if (filter.dateTo) {
        appliedAt.$lte = new Date(`${filter.dateTo}T23:59:59.999Z`);
      }

      query.appliedAt = appliedAt;
    }
    console.log("querjslk", query);

    if (filter.userId) {
      query.user = new mongoose.Types.ObjectId(filter.userId);
    }

    const aggregation: PipelineStage[] = [
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },

      // ✅ Correct place for search
      ...(filter.search
        ? [
            {
              $match: {
                $or: [
                  {
                    "userDetails.name": {
                      $regex: filter.search,
                      $options: "i",
                    },
                  },
                  {
                    "userDetails.email": {
                      $regex: filter.search,
                      $options: "i",
                    },
                  },
                ],
              },
            },
          ]
        : []),

      {
        $project: {
          _id: 1,
          appliedAt: 1,
          status: 1,
          user: {
            name: "$userDetails.name",
            email: "$userDetails.email",
            profilePicture: "$userDetails.profilePicture",
          },
        },
      },

      { $sort: { appliedAt: -1 } },

      {
        $facet: {
          paginatedResults: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "total" }],
        },
      },
      {
        $project: {
          applications: "$paginatedResults",
          total: { $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0] },
        },
      },
    ];

    const result = await applicationModel.aggregate<{
      applications: ApplicantRawData[];
      total: number;
    }>(aggregation);

    return {
      applications: result[0]?.applications ?? [],
      total: result[0]?.total ?? 0,
    };
  }

  async findWithUserAndJobById(
    applicationId: string
  ): Promise<IApplicationPopulatedUserAndJob | null> {
    if (!Types.ObjectId.isValid(applicationId)) return null;
    const objectId = new Types.ObjectId(applicationId);
    return this.model
      .findById(objectId)
      .populate("user", "_id name username profilePicture")
      .populate("job", "_id title company")
      .lean<IApplicationPopulatedUserAndJob>()
      .exec();
  }

  async CreateApplication(input: ApplyToJobInput): Promise<IApplication> {
    try {
      const { jobId, userId, resumeMediaId } = input;

      if (!jobId || !userId || !resumeMediaId) {
        throw new Error("Missing jobId, userId or resumeMediaId");
      }
      const application = new this.model({
        job: new Types.ObjectId(jobId),
        user: new Types.ObjectId(userId),
        resumeMediaId: new Types.ObjectId(resumeMediaId),
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

  async findByJobId(jobId: string): Promise<IApplication[]> {
    return this.findAll({ job: new Types.ObjectId(jobId) });
  }

  async findByUserId(userId: string): Promise<IApplication[]> {
    return this.findAll({ user: new Types.ObjectId(userId) });
  }

  async findByIdWithUserAndJob(
    applicationId: string
  ): Promise<PopulatedApplication | null> {
    return this.model
      .findById(applicationId)
      .populate("user", "name username profilePicture")
      .populate("job")
      .lean()
      .exec() as Promise<PopulatedApplication | null>;
  }

  async hasUserApplied(jobId: string, userId: string): Promise<boolean> {
    const count = await this.model.countDocuments({
      job: new Types.ObjectId(jobId),
      user: new Types.ObjectId(userId),
    });
    return count > 0;
  }
}
