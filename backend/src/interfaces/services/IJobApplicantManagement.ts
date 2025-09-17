import { ApplicationStatus } from "../../core/enums/applicationStatus";
import { ApplicationResponseDTO } from "../../mapping/company/applicant/aplicationtwo.mapper";
import { IApplication } from "../../repositories/entities/application.entity";

export interface IJobApplicantManagementService {
  
  getApplicationWithDetails(
    applicationId: string
  ): Promise<ApplicationResponseDTO | null>;
  updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
    reason?: string,
    scheduledAt?: Date
  ): Promise<IApplication | null>;

}
