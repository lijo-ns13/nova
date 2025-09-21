import { IBaseRepository } from "./IBaseRepository";

import {
  ApplicantRawData,
  GetApplicationsQuery,
} from "../../core/dtos/company/getapplications.dto";
import { PopulatedApplication } from "../../mapping/company/applicant/aplicationtwo.mapper";

import {
  IApplicationPopulatedJob,
  IApplicationPopulatedUserAndJob,
} from "../../repositories/entities/applicationPopulated.entity";
import { IApplication } from "../../repositories/entities/application.entity";
import { ApplicationStatus } from "../../core/enums/applicationStatus";
import { ApplyToJobInput } from "../../repositories/mongo/UserApplicationRepository";
import {
  ApplicationStatusCount,
  DailyTrend,
  MonthlyTrend,
  WeeklyTrend,
} from "../../core/entities/dashbaord.interface";

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
  // new udpated
  countApplications(jobIds: string[]): Promise<number>;
  countApplicationsSince(jobIds: string[], date: Date): Promise<number>;
  aggregateStatusCounts(jobIds: string[]): Promise<ApplicationStatusCount[]>;
  aggregateDailyTrend(jobIds: string[], fromDate: Date): Promise<DailyTrend[]>;
  aggregateWeeklyTrend(
    jobIds: string[],
    fromDate: Date
  ): Promise<WeeklyTrend[]>;
  aggregateMonthlyTrend(
    jobIds: string[],
    fromDate: Date
  ): Promise<MonthlyTrend[]>;
}
