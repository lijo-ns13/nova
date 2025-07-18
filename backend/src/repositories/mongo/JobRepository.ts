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
import {
  IJobPopulated,
  IJobWithCompanyAndSkills,
} from "../../mapping/user/jobmapper";
import { ICompany } from "../../models/company.modal";

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

  async getJob(jobId: string): Promise<any> {
    return await jobModal
      .findById(jobId)
      .populate<{ skillsRequired: ISkill[] }>("skillsRequired")
      .populate<{ company: Pick<ICompany, "_id" | "companyName"> }>("company")
      .exec();
  }

  async getAllJobs(
    page: number,
    limit: number,
    filters: Record<string, unknown>
  ): Promise<{ jobs: IJobPopulated[]; total: number; totalPages: number }> {
    const query = filters;

    const total = await jobModal.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const jobs = await jobModal
      .find(query)
      .populate<{ skillsRequired: ISkill[] }>("skillsRequired")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

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
