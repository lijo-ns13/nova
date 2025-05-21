import mongoose, { Types } from "mongoose";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  CreateJobDto,
  IJobRepository,
  UpdateJobDto,
} from "../../interfaces/repositories/IJobRepository";
import jobModal, { IJob, ApplicationStatus } from "../../models/job.modal";
import applicationModal, { IApplication } from "../../models/application.modal";

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

    // First verify the job belongs to the company
    const job = await jobModal.findOne({
      _id: jobId,
      company: companyId,
    });

    if (!job) {
      return null;
    }

    const [applications, total] = await Promise.all([
      applicationModal
        .find({ job: jobId })
        .populate({
          path: "user",
          select: "-password -documents", // exclude sensitive fields
        })
        .populate({
          path: "statusHistory.changedBy",
          select: "name email", // only include necessary fields
        })
        .sort({ appliedAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      applicationModal.countDocuments({ job: jobId }),
    ]);

    return { applications, total };
  }
  async getJob(jobId: string) {
    // console.log("jobId from jobrepo getJob..", jobId);
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
  async findApplicationsByFilter(
    filter: Record<string, any>,
    page: number = 1,
    limit: number = 10,
    jobId: string
  ): Promise<{ applications: any[]; total: number }> {
    const skip = (page - 1) * limit;

    // Build the query for applications collection
    const query: any = {};

    // Job filter (always apply from jobId param)
    if (jobId) {
      query.job = new mongoose.Types.ObjectId(jobId);

      // If companyId is provided, ensure the job belongs to that company
      if (filter.companyId) {
        const jobExists = await jobModal.exists({
          _id: jobId,
          company: filter.companyId,
        });
        if (!jobExists) {
          return { applications: [], total: 0 };
        }
      }
    }

    // Status filter
    if (filter.status) {
      query.status = {
        $in: Array.isArray(filter.status) ? filter.status : [filter.status],
      };
    }

    // Date range filters
    if (filter.dateFrom || filter.dateTo) {
      query.appliedAt = {};
      if (filter.dateFrom) query.appliedAt.$gte = new Date(filter.dateFrom);
      if (filter.dateTo) query.appliedAt.$lte = new Date(filter.dateTo);
    }

    // User ID filter
    if (filter.userId) {
      query.user = new mongoose.Types.ObjectId(filter.userId);
    }

    // Aggregation pipeline
    const aggregationPipeline: any[] = [
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
      {
        $lookup: {
          from: "jobs",
          localField: "job",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      { $unwind: "$jobDetails" },
      // Add lookup for media to get the resume file details
      {
        $lookup: {
          from: "media",
          localField: "resumeMediaId",
          foreignField: "_id",
          as: "resumeMedia",
        },
      },
      { $unwind: "$resumeMedia" },
      {
        $project: {
          _id: 1,
          appliedAt: 1,
          resumeMediaId: 1,
          coverLetter: 1,
          status: 1,
          statusHistory: 1,
          user: {
            _id: "$userDetails._id",
            name: "$userDetails.name",
            email: "$userDetails.email",
            avatar: "$userDetails.avatar",
          },
          job: {
            _id: "$jobDetails._id",
            title: "$jobDetails.title",
            company: "$jobDetails.company",
          },
          resumeMedia: {
            s3Key: "$resumeMedia.s3Key",
            mimeType: "$resumeMedia.mimeType",
          },
        },
      },
    ];

    // Search filter by user name or email (after lookup)
    if (filter.search) {
      aggregationPipeline.push({
        $match: {
          $or: [
            { "user.name": { $regex: filter.search, $options: "i" } },
            { "user.email": { $regex: filter.search, $options: "i" } },
          ],
        },
      });
    }

    aggregationPipeline.push(
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
      }
    );

    const result = await applicationModal.aggregate(aggregationPipeline);
    const applicationsData = result[0] || { applications: [], total: 0 };

    // Generate signed URLs for each resume
    if (applicationsData.applications.length > 0) {
      const s3 = new S3Client({
        region: process.env.AWS_REGION!,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });

      await Promise.all(
        applicationsData.applications.map(async (app: any) => {
          try {
            const command = new GetObjectCommand({
              Bucket: process.env.S3_BUCKET_NAME!,
              Key: app.resumeMedia.s3Key,
            });
            app.resumeUrl = await getSignedUrl(s3, command, {
              expiresIn: 3600,
            });
          } catch (error) {
            console.error(
              `Failed to generate signed URL for application ${app._id}:`,
              error
            );
            app.resumeUrl = null;
          }
          return app;
        })
      );
    }

    return applicationsData;
  }
  // new changest for shorlist,reject
  async shortlistApplication(applicationId: string): Promise<boolean> {
    const updated = await applicationModal.findByIdAndUpdate(
      applicationId,
      { status: ApplicationStatus.SHORTLISTED },
      { new: true }
    );
    return !!updated;
  }

  async rejectApplication(
    applicationId: string,
    rejectionReason?: string
  ): Promise<boolean> {
    const updated = await applicationModal.findByIdAndUpdate(
      applicationId,
      { status: ApplicationStatus.REJECTED, rejectionReason: rejectionReason },
      { new: true }
    );
    return !!updated;
  }
  // applicant detailed page
  async getApplicantDetails(applicantId: string): Promise<any> {
    return await applicationModal.findById(applicantId).populate("user");
  }
}
