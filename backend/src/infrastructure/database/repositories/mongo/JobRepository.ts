import mongoose, { Types } from "mongoose";

import {
  CreateJobDto,
  IJobRepository,
  UpdateJobDto,
} from "../../../../core/interfaces/repositories/IJobRepository";
import jobModal, { IJob, ApplicationStatus } from "../../models/job.modal";

export class JobRepository implements IJobRepository {
  async createJob(
    createJobDto: CreateJobDto,
    companyId: string
  ): Promise<IJob> {
    const job = new jobModal({
      ...createJobDto,
      company: new mongoose.Types.ObjectId(companyId),
    });
    return await job.save();
  }

  async updateJob(
    jobId: string,
    companyId: string,
    updateJobDto: UpdateJobDto
  ): Promise<IJob | null> {
    const job = await jobModal.findOneAndUpdate(
      { _id: jobId, company: companyId },
      { $set: updateJobDto },
      { new: true }
    );
    return job;
  }

  async deleteJob(jobId: string, companyId: string): Promise<boolean> {
    const result = await jobModal.deleteOne({ _id: jobId, company: companyId });
    return result.deletedCount === 1;
  }
  async getJobs(
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ jobs: IJob[]; total: number }> {
    const skip = (page - 1) * limit;
    const [jobs, total] = await Promise.all([
      jobModal
        .find({ company: companyId })
        .skip(skip)
        .limit(limit)
        .populate("skillsRequired")
        .sort({ createdAt: -1 })
        .exec(),
      jobModal.countDocuments({ company: companyId }),
    ]);
    return { jobs, total };
  }

  async getJobApplications(
    jobId: string,
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ applications: any[]; total: number } | null> {
    const skip = (page - 1) * limit;

    const result = await jobModal.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(jobId),
          company: new mongoose.Types.ObjectId(companyId),
        },
      },
      {
        $project: {
          applications: 1,
        },
      },
      {
        $unwind: "$applications",
      },
      {
        $sort: { "applications.appliedAt": -1 }, // optional: sort by latest
      },
      {
        $facet: {
          paginatedApplications: [
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "users",
                localField: "applications.user",
                foreignField: "_id",
                as: "userData",
              },
            },
            {
              $unwind: "$userData",
            },
            {
              $project: {
                _id: "$applications._id",
                resumeUrl: "$applications.resumeUrl",
                status: "$applications.status",
                statusHistory: "$applications.statusHistory",
                appliedAt: "$applications.appliedAt",
                user: "$userData",
              },
            },
          ],
          totalCount: [
            {
              $count: "total",
            },
          ],
        },
      },
      {
        $project: {
          applications: "$paginatedApplications",
          total: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
          },
        },
      },
    ]);

    return result.length > 0
      ? { applications: result[0].applications, total: result[0].total }
      : null;
  }

  async getJob(jobId: string) {
    console.log("jobId from jobrepo getJob..", jobId);
    return jobModal
      .find({
        status: "open",
        _id: jobId,
        // applicationDeadline: { $gte: new Date() },
      })
      .populate([
        { path: "skillsRequired" },
        { path: "company", select: "-password -documents" },
      ]);
  }
  async getAllJobs(): Promise<IJob[]> {
    return jobModal
      .find({
        status: "open",
        applicationDeadline: { $gte: new Date() },
      })
      .populate([
        { path: "skillsRequired" },
        { path: "company", select: "-password -documents" },
      ])
      .sort({ createdAt: -1 });
  }

  async applyToJob(
    jobId: string,
    userId: string,
    resumeUrl: string
  ): Promise<IJob> {
    const job = await jobModal.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    const alreadyApplied = job.applications.find(
      (app) => app.user.toString() === userId
    );

    if (alreadyApplied) {
      throw new Error("User has already applied for this job");
    }

    const newApplication = {
      user: new Types.ObjectId(userId),
      appliedAt: new Date(),
      resumeUrl,
      status: ApplicationStatus.APPLIED,
      statusHistory: [
        {
          status: ApplicationStatus.APPLIED,
          changedAt: new Date(),
        },
      ],
    };

    job.applications.push(newApplication);
    await job.save();

    return job;
  }
}
