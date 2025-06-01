import {
  ApplicationStatus,
  IApplication,
} from "../../models/application.modal";

export interface IJobApplicantManagementService {
  getApplicationsByJob(jobId: string): Promise<IApplication[]>;
  getApplicationsByUser(userId: string): Promise<IApplication[]>;
  getApplicationWithDetails(
    applicationId: string
  ): Promise<IApplication | null>;
  updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    reason?: string,
    scheduledAt?: Date
  ): Promise<IApplication | null>;
  createApplication(data: {
    job: string;
    user: string;
    resumeMediaId: string;
  }): Promise<IApplication>;
}
