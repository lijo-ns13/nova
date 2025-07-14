import { GetAllJobsQueryInput } from "../../core/validations/user/user.jobschema";
import { JobResponseDTO } from "../../mapping/user/jobmapper";
import { IApplication } from "../../models/application.modal";
import { IJob } from "../../models/job.modal";
import { IAppliedJob } from "../../repositories/mongo/ApplicationRepository";

export interface IUserJobService {
  // Get all jobs that are open and not past deadline
  getAllJobs(
    query: GetAllJobsQueryInput
  ): Promise<{ jobs: JobResponseDTO[]; total: number; totalPages: number }>;
  // Get a single job by ID (only if open and not past deadline)
  getJob(jobId: string): Promise<any>;
  getAppliedJobs(userId: string): Promise<IAppliedJob[]>;
  // Apply to a job and record the application in the user's record
  applyToJob(
    jobId: string,
    userId: string,
    resumeFile: Express.Multer.File
  ): Promise<void>;
  hasApplied(jobId: string, userId: string): Promise<boolean>;
}
