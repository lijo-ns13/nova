import { inject } from "inversify";
import { IJobRepository } from "../../interfaces/repositories/IJobRepository";
import { TYPES } from "../../di/types";
import { ICompanyJobService } from "../../interfaces/services/ICompanyJobService";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { IApplicationRepository } from "../../interfaces/repositories/IUserApplicationRepository";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { JobMapper } from "../../mapping/job.mapper";
import {
  CreateJobInput,
  JobResponseDto,
  UpdateJobInput,
} from "../../core/dtos/company/job.dto";
import logger from "../../utils/logger";
import { ApplicationStatus } from "../../core/enums/applicationStatus";
import {
  ApplicantSummaryDTO,
  GetApplicationsQuery,
} from "../../core/dtos/company/getapplications.dto";
import { ApplicationJobMapper } from "../../mapping/company/job.application.mapper";
import { ApplicationGetMapper } from "../../mapping/company/getApplicant.mapper";
import { ApplicantDetailDTO } from "../../core/dtos/company/getApplicant.dto";
import { NotificationType } from "../../constants/notification.type.constant";
import { COMMON_MESSAGES } from "../../constants/message.constants";

export class CompanyJobService implements ICompanyJobService {
  private logger = logger.child({ context: "companyjobservice" });
  constructor(
    @inject(TYPES.JobRepository)
    private readonly _jobRepository: IJobRepository,
    @inject(TYPES.MediaService) private readonly _mediaService: IMediaService,
    @inject(TYPES.ApplicationRepository)
    private readonly _applicationRepo: IApplicationRepository,
    @inject(TYPES.NotificationService)
    private readonly _notificationService: INotificationService
  ) {}
  async createJob(
    input: CreateJobInput,
    companyId: string
  ): Promise<JobResponseDto> {
    const job = await this._jobRepository.createJob(input, companyId);
    return JobMapper.toResponseDto(job);
  }

  async updateJob(
    jobId: string,
    companyId: string,
    updated: UpdateJobInput
  ): Promise<JobResponseDto | null> {
    const job = await this._jobRepository.updateJob(jobId, companyId, updated);
    return job ? JobMapper.toResponseDto(job) : null;
  }

  async deleteJob(jobId: string, companyId: string): Promise<boolean> {
    return await this._jobRepository.deleteJob(jobId, companyId);
  }
  async getJobs(
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ jobs: JobResponseDto[]; total: number }> {
    const { jobs, total } = await this._jobRepository.getJobs(
      companyId,
      page,
      limit
    );
    return {
      jobs: jobs.map(JobMapper.toResponseWithSkillDto),
      total,
    };
  }
  async getJob(jobId: string): Promise<JobResponseDto> {
    const job = await this._jobRepository.getJob(jobId);
    if (!job) {
      this.logger.warn(COMMON_MESSAGES.JOB_NOT_FOUND);
      throw new Error(COMMON_MESSAGES.JOB_NOT_FOUND);
    }
    return JobMapper.toResponseWithSkillDto(job);
  }

  async shortlistApplication(applicationId: string): Promise<boolean> {
    const application = await this._applicationRepo.findWithUserAndJobById(
      applicationId
    );
    if (!application) return false;

    await this._notificationService.sendNotification(
      application.user._id.toString(),
      `Congrats! Your application for "${application.job.title}" is shortlisted.`,
      NotificationType.JOB,
      application.job.company.toString()
    );

    const res = await this._applicationRepo.updateStatus(
      applicationId,
      ApplicationStatus.SHORTLISTED
    );
    this.logger.info("application shortlisted successfully✅");
    return !!res;
  }

  async rejectApplication(
    applicationId: string,
    reason?: string
  ): Promise<boolean> {
    const application = await this._applicationRepo.findWithUserAndJobById(
      applicationId
    );
    if (!application) return false;

    await this._notificationService.sendNotification(
      application.user._id.toString(),
      `Congrats! Your application for "${application.job.title}" is shortlisted.`,
      NotificationType.JOB,
      application.job.company.toString()
    );

    const res = await this._applicationRepo.updateStatus(
      applicationId,
      ApplicationStatus.REJECTED,
      reason
    );
    return !!res;
  }

  async getApplicantDetails(
    applicationId: string
  ): Promise<ApplicantDetailDTO | null> {
    const applicant = await this._jobRepository.getApplicantDetails(
      applicationId
    );
    if (!applicant) return null;

    const resumeUrl = applicant.resumeMediaId?.s3Key
      ? await this._mediaService.getMediaUrl(applicant.resumeMediaId.s3Key)
      : null;

    return ApplicationGetMapper.toDetailDTO(applicant, resumeUrl);
  }
  async getApplications(
    page: number = 1,
    limit: number = 10,
    filters: GetApplicationsQuery,
    jobId: string
  ): Promise<{
    applications: ApplicantSummaryDTO[];
    pagination: {
      totalApplications: number;
      totalPages: number;
      currentPage: number;
      applicationsPerPage: number;
    };
  }> {
    const { applications, total } =
      await this._applicationRepo.findApplicationsByFilter(
        filters,
        page,
        limit,
        jobId
      );

    const mapped = applications.map(ApplicationJobMapper.toApplicantSummaryDTO);

    return {
      applications: mapped,
      pagination: {
        totalApplications: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        applicationsPerPage: limit,
      },
    };
  }
}
