import { IApplication } from "../../models/application.modal";
import { IJob } from "../../models/job.modal";

export interface IUserJobService {
  // Get all jobs that are open and not past deadline
  getAllJobs(
    page?: number,
    limit?: number,
    filters?: Record<string, any>
  ): Promise<{ jobs: IJob[]; total: number; totalPages: number }>;

  // Get a single job by ID (only if open and not past deadline)
  getJob(jobId: string): Promise<IJob | null>;

  // Apply to a job and record the application in the user's record
  applyToJob(
    jobId: string,
    userId: string,
    resumeFile: Express.Multer.File,
    coverLetter?: string
  ): Promise<IApplication>;

  // Get jobs the user has saved
  getSavedJobs(userId: string): Promise<IJob[]>;

  // Get jobs the user has applied to

  getAppliedJobs(userId: string): Promise<any>;
  // Save a job to user's saved jobs list
  addToSavedJobs(userId: string, jobId: string): Promise<void>;

  // Remove a job from user's saved jobs list
  removeFromSavedJobs(userId: string, jobId: string): Promise<void>;
  hasApplied(jobId: string, userId: string): Promise<boolean>;
}
