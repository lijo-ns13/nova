// src/interfaces/repositories/IApplicationRepository.ts
import { IBaseRepository } from "./IBaseRepository";
import {
  IApplication,
  ApplicationStatus,
} from "../../models/application.modal";
import { IApplicationWithUserAndJob } from "../../core/dtos/company/application.dto";
import {
  ApplicantRawData,
  GetApplicationsQuery,
} from "../../core/dtos/company/getapplications.dto";
import { PopulatedApplication } from "../../mapping/company/applicant/aplicationtwo.mapper";
import { ApplyToJobInput } from "../../repositories/mongo/ApplicationRepository";

export interface IApplicationRepository extends IBaseRepository<IApplication> {
  findWithUserAndJobById(
    applicationId: string
  ): Promise<IApplicationWithUserAndJob | null>;
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

  findByJobIdAndPop(userId: string): Promise<IApplication[]>;
  // findByJobIdAndPop(userId: string): Promise<IApplicationWithPopulatedJob[]>;

  CreateApplication(input: ApplyToJobInput): Promise<IApplication>;
  rejectApplication(applicationId: string, reason?: string): Promise<boolean>;
  shortlistApplication(applicationId: string): Promise<boolean>;
  hasUserApplied(jobId: string, userId: string): Promise<boolean>;
}
