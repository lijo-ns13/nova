// src/modules/job/services/JobService.ts

import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import {
  ApplicationStatus,
  IApplication,
} from "../../models/application.modal";
import { IJobApplicantManagementService } from "../../interfaces/services/IJobApplicantManagement";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { AppIntegrations } from "aws-sdk";
const statusesRequiringReason: ApplicationStatus[] = [
  ApplicationStatus.REJECTED,
  ApplicationStatus.INTERVIEW_RESCHEDULED,
  ApplicationStatus.INTERVIEW_CANCELLED,
  ApplicationStatus.INTERVIEW_REJECTED_BY_USER,
  ApplicationStatus.OFFER_REJECTED,
  ApplicationStatus.WITHDRAWN,
];
const allowedTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  [ApplicationStatus.APPLIED]: [
    ApplicationStatus.SHORTLISTED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
  ],
  [ApplicationStatus.SHORTLISTED]: [
    ApplicationStatus.INTERVIEW_SCHEDULED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
  ],
  [ApplicationStatus.INTERVIEW_SCHEDULED]: [
    ApplicationStatus.INTERVIEW_RESCHEDULED,
    ApplicationStatus.INTERVIEW_CANCELLED,
    ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER,
    ApplicationStatus.INTERVIEW_REJECTED_BY_USER,
  ],
  [ApplicationStatus.INTERVIEW_RESCHEDULED]: [
    ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER,
    ApplicationStatus.INTERVIEW_REJECTED_BY_USER,
  ],
  [ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER]: [
    ApplicationStatus.INTERVIEW_COMPLETED,
  ],
  [ApplicationStatus.INTERVIEW_COMPLETED]: [
    ApplicationStatus.INTERVIEW_PASSED,
    ApplicationStatus.INTERVIEW_FAILED,
  ],
  [ApplicationStatus.INTERVIEW_PASSED]: [ApplicationStatus.OFFERED],
  [ApplicationStatus.OFFERED]: [
    ApplicationStatus.OFFER_ACCEPTED,
    ApplicationStatus.OFFER_REJECTED,
  ],
  [ApplicationStatus.OFFER_ACCEPTED]: [ApplicationStatus.HIRED],
  [ApplicationStatus.OFFER_REJECTED]: [],
  [ApplicationStatus.INTERVIEW_REJECTED_BY_USER]: [],
  [ApplicationStatus.INTERVIEW_CANCELLED]: [],
  [ApplicationStatus.INTERVIEW_FAILED]: [],
  [ApplicationStatus.REJECTED]: [],
  [ApplicationStatus.WITHDRAWN]: [],
  [ApplicationStatus.HIRED]: [],
  [ApplicationStatus.SELECTED]: [],
};

@injectable()
export class JobApplicantManagementService
  implements IJobApplicantManagementService
{
  constructor(
    @inject(TYPES.ApplicationRepository)
    private _applicationRepo: IApplicationRepository,

    @inject(TYPES.MediaService)
    private _mediaService: IMediaService
  ) {}

  async getApplicationsByJob(jobId: string): Promise<IApplication[]> {
    return this._applicationRepo.findByJobId(jobId);
  }

  async getApplicationsByUser(userId: string): Promise<IApplication[]> {
    return this._applicationRepo.findByUserId(userId);
  }

  async getApplicationWithDetails(
    applicationId: string
  ): Promise<IApplication | null> {
    const application = await this._applicationRepo.findByIdWithUserAndJob(
      applicationId
    );
    if (!application) return null;

    const applicationObj = application.toObject?.() || application;
    const media = await this._mediaService.getMediaById(
      application.resumeMediaId.toString()
    );
    if (media?.s3Key) {
      const resumeUrl = await this._mediaService.getMediaUrl(media.s3Key);
      return {
        ...applicationObj,
        resumeUrl,
      };
    }

    return applicationObj;
  }

  async updateApplicationStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    reason?: string
  ): Promise<IApplication | null> {
    if (!newStatus) throw new Error("Status is required");
    if (
      newStatus == ApplicationStatus.INTERVIEW_SCHEDULED ||
      newStatus == ApplicationStatus.INTERVIEW_RESCHEDULED
    ) {
      throw new Error("interview shculed cant do like this");
    }
    if (
      newStatus == ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER ||
      newStatus == ApplicationStatus.INTERVIEW_REJECTED_BY_USER
    ) {
      throw new Error("this things in user side");
    }
    const application = await this._applicationRepo.findById(applicationId);
    if (!application) throw new Error("Application not found");

    const currentStatus = application.status;

    // Validate transition
    const allowedNextStatuses = allowedTransitions[currentStatus];
    if (!allowedNextStatuses.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }

    // Enforce reason if needed
    const statusesRequiringReason: ApplicationStatus[] = [
      ApplicationStatus.REJECTED,
      ApplicationStatus.INTERVIEW_RESCHEDULED,
      ApplicationStatus.INTERVIEW_CANCELLED,
      ApplicationStatus.INTERVIEW_REJECTED_BY_USER,
      ApplicationStatus.OFFER_REJECTED,
      ApplicationStatus.WITHDRAWN,
    ];

    if (statusesRequiringReason.includes(newStatus) && !reason) {
      throw new Error(`Reason is required for status: ${newStatus}`);
    }

    // Proceed with update
    return this._applicationRepo.updateStatus(applicationId, newStatus, reason);
  }

  async createApplication(data: {
    job: string;
    user: string;
    resumeMediaId: string;
  }): Promise<IApplication> {
    return this._applicationRepo.create(data);
  }
}
