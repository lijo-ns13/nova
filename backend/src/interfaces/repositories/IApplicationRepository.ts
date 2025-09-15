import { IBaseRepository } from "./IBaseRepository";

import {
  ApplicantRawData,
  GetApplicationsQuery,
} from "../../core/dtos/company/getapplications.dto";
import { PopulatedApplication } from "../../mapping/company/applicant/aplicationtwo.mapper";
import { ApplyToJobInput } from "../../repositories/mongo/ApplicationRepository";

import {
  IApplicationPopulatedJob,
  IApplicationPopulatedUserAndJob,
} from "../../repositories/entities/applicationPopulated.entity";
import { IApplication } from "../../repositories/entities/application.entity";
import { ApplicationStatus } from "../../core/enums/applicationStatus";

export interface IApplicationRepository extends IBaseRepository<IApplication> {
  findAppliedJobs(userId: string): Promise<IApplicationPopulatedJob[]>;
  findWithUserAndJobById(
    applicationId: string
  ): Promise<IApplicationPopulatedUserAndJob | null>;
  updateStatus(
    applicationId: string,
    status: ApplicationStatus,
    reason?: string,
    scheduledAt?: Date
  ): Promise<IApplication | null>;
  findApplicationsByFilter(
    filter: GetApplicationsQuery,
    page: number,
    limit: number,
    jobId: string
  ): Promise<{ applications: ApplicantRawData[]; total: number }>;
  findByJobId(jobId: string): Promise<IApplication[]>;

  findByUserId(userId: string): Promise<IApplication[]>;
  CreateApplication(input: ApplyToJobInput): Promise<IApplication>;
  rejectApplication(applicationId: string, reason?: string): Promise<boolean>;
  shortlistApplication(applicationId: string): Promise<boolean>;
  hasUserApplied(jobId: string, userId: string): Promise<boolean>;
  findByIdWithUserAndJob(
    applicationId: string
  ): Promise<PopulatedApplication | null>;
}
