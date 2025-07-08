import mongoose, { Model, Types, PipelineStage } from "mongoose";

const aggregation: PipelineStage[] = [];

import {
  CreateJobDto,
  IJobRepository,
  UpdateJobDto,
} from "../../interfaces/repositories/IJobRepository";
import jobModal, { IJob, ApplicationStatus } from "../../models/job.modal";
import applicationModal, { IApplication } from "../../models/application.modal";
import { BaseRepository } from "./BaseRepository";
import { inject } from "inversify";
import { TYPES } from "../../di/types";
import { IJobWithSkills } from "../../mapping/job.mapper";
import { ISkill } from "../../models/skill.modal";

type PopulatedUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  username: string;
  profilePicture?: string;
  headline?: string;
};

type PopulatedResumeMedia = {
  _id: Types.ObjectId;
  s3Key: string;
};

export type PopulatedApplicationWithUserAndResume = Omit<
  IApplication,
  "user" | "resumeMediaId"
> & {
  user: PopulatedUser;
  resumeMediaId: PopulatedResumeMedia;
};

export class JobRepository
  extends BaseRepository<IJob>
  implements IJobRepository
{
  constructor(@inject(TYPES.jobModal) jobModal: Model<IJob>) {
    super(jobModal);
  }
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
      {
        _id: new mongoose.Types.ObjectId(jobId),
        company: new mongoose.Types.ObjectId(companyId),
      },
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
  ): Promise<{ jobs: IJobWithSkills[]; total: number }> {
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      jobModal
        .find({ company: companyId })
        .skip(skip)
        .limit(limit)
        .populate<{ skillsRequired: ISkill[] }>("skillsRequired") // ✅ typed populate
        .sort({ createdAt: -1 })
        .exec(),
      jobModal.countDocuments({ company: companyId }),
    ]);

    return { jobs, total };
  }

  async getJob(jobId: string): Promise<IJobWithSkills | null> {
    return await jobModal
      .findById(jobId)
      .populate<{ skillsRequired: ISkill[] }>("skillsRequired") // ✅ typed populate
      .exec();
  }

  async getAllJobs(
    page: number = 1,
    limit: number = 10,
    filters: Record<string, any> = {}
  ): Promise<{ jobs: IJob[]; total: number; totalPages: number }> {
    // Base query for open jobs with valid deadline
    const query: any = {
      status: "open",
      applicationDeadline: { $gte: new Date() },
    };

    // Apply filters if provided
    if (filters) {
      if (filters.title) {
        query.title = { $regex: filters.title, $options: "i" };
      }
      if (filters.location) {
        query.location = { $regex: filters.location, $options: "i" };
      }
      if (filters.jobType) {
        query.jobType = {
          $in: Array.isArray(filters.jobType)
            ? filters.jobType
            : [filters.jobType],
        };
      }
      if (filters.employmentType) {
        query.employmentType = {
          $in: Array.isArray(filters.employmentType)
            ? filters.employmentType
            : [filters.employmentType],
        };
      }
      if (filters.experienceLevel) {
        query.experienceLevel = {
          $in: Array.isArray(filters.experienceLevel)
            ? filters.experienceLevel
            : [filters.experienceLevel],
        };
      }
      if (filters.skills) {
        query.skillsRequired = { $in: filters.skills };
      }
      if (filters.minSalary) {
        query["salary.min"] = { $gte: Number(filters.minSalary) };
      }
      if (filters.maxSalary) {
        query["salary.max"] = { $lte: Number(filters.maxSalary) };
      }
      if (filters.company) {
        query.company = filters.company;
      }
    }

    const total = await jobModal.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const jobs = await jobModal
      .find(query)
      .populate([
        { path: "skillsRequired" },
        { path: "company", select: "-password -documents" },
      ])
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return { jobs, total, totalPages };
  }

  async applyToJob(
    jobId: string,
    userId: string,
    resumeUrl: string,
    coverLetter?: string
  ): Promise<IApplication> {
    const job = await jobModal.findById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    // Check if application deadline has passed
    if (job.applicationDeadline < new Date()) {
      throw new Error("Application deadline has passed");
    }

    // Check if user already applied
    const existingApplication = await applicationModal.findOne({
      job: jobId,
      user: userId,
    });

    if (existingApplication) {
      throw new Error("User has already applied for this job");
    }

    // Create new application
    const application = new applicationModal({
      job: jobId,
      user: userId,
      appliedAt: new Date(),
      resumeUrl,
      coverLetter,
      status: ApplicationStatus.APPLIED,
      statusHistory: [
        {
          status: ApplicationStatus.APPLIED,
          changedAt: new Date(),
          changedBy: userId,
        },
      ],
    });

    await application.save();
    return application;
  }

  // new changest for shorlist,reject

  // applicant detailed page
  async getApplicantDetails(
    applicantId: string
  ): Promise<PopulatedApplicationWithUserAndResume | null> {
    if (!mongoose.Types.ObjectId.isValid(applicantId)) {
      return null; // Prevent crash on invalid ObjectId
    }

    const objectId = new mongoose.Types.ObjectId(applicantId);
    return applicationModal
      .findById(objectId)
      .populate("user", "name username email profilePicture headline")
      .populate("resumeMediaId", "s3Key")
      .exec() as Promise<PopulatedApplicationWithUserAndResume | null>;
  }
}
