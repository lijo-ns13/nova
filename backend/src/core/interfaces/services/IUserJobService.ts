import { IJob } from "../../../infrastructure/database/models/job.modal";

export interface IUserJobService {
  // Get all jobs that are open and not past deadline
  getAllJobs(): Promise<IJob[]>;

  // Get a single job by ID (only if open and not past deadline)
  getJob(jobId: string): Promise<IJob | null>;

  // Apply to a job and record the application in the user's record
  applyToJob(jobId: string, userId: string, resumeUrl: string): Promise<IJob>;

  // Get jobs the user has saved
  getSavedJobs(userId: string): Promise<IJob[]>;

  // Get jobs the user has applied to
  getAppliedJobs(userId: string): Promise<IJob[]>;

  // Save a job to user's saved jobs list
  addToSavedJobs(userId: string, jobId: string): Promise<void>;

  // Remove a job from user's saved jobs list
  removeFromSavedJobs(userId: string, jobId: string): Promise<void>;
}
