import { GetAllJobsQueryInput } from "../../core/validations/user/user.jobschema";
import { JobResponseDTO } from "../../mapping/user/jobmapper";
import { IApplication } from "../../models/application.modal";
import { IJob } from "../../models/job.modal";

export interface IUserJobService {
  // Get all jobs that are open and not past deadline
  getAllJobs(
    query: GetAllJobsQueryInput
  ): Promise<{ jobs: JobResponseDTO[]; total: number; totalPages: number }>;
  // Get a single job by ID (only if open and not past deadline)
  getJob(jobId: string): Promise<IJob | null>;

  // Apply to a job and record the application in the user's record
  applyToJob(
    jobId: string,
    userId: string,
    resumeFile: Express.Multer.File,
    coverLetter?: string
  ): Promise<IApplication>;

  getAppliedJobs(userId: string): Promise<any>;
  hasApplied(jobId: string, userId: string): Promise<boolean>;
}
