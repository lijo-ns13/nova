import { ApplicationResponseDTO } from "../../mapping/company/applicant/aplicationtwo.mapper";
import {
  ApplicationStatus,
  IApplication,
} from "../../models/application.modal";

export interface IJobApplicantManagementService {
  // getApplicationsByJob(jobId: string): Promise<IApplication[]>;
  // getApplicationsByUser(userId: string): Promise<IApplication[]>;
  getApplicationWithDetails(
    applicationId: string
  ): Promise<ApplicationResponseDTO | null>;
  updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    reason?: string,
    scheduledAt?: Date
  ): Promise<IApplication | null>;
  // createApplication(data: {
  //   job: string;
  //   user: string;
  //   resumeMediaId: string;
  // }): Promise<IApplication>;
}
