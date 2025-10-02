import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IApplicationRepository } from "../../interfaces/repositories/IUserApplicationRepository";
import { IJobApplicantManagementService } from "../../interfaces/services/IJobApplicantManagement";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { allowedTransitions } from "../../utils/allowedTransitions";
import {
  ApplicationMapper,
  ApplicationResponseDTO,
} from "../../mapping/company/applicant/aplicationtwo.mapper";
import { IJobRepository } from "../../interfaces/repositories/IJobRepository";
import { ApplicationStatus } from "../../core/enums/applicationStatus";
import { IApplication } from "../../repositories/entities/application.entity";
import { NotificationType } from "../../constants/notification.type.constant";
import { COMMON_MESSAGES } from "../../constants/message.constants";

@injectable()
export class JobApplicantManagementService
  implements IJobApplicantManagementService
{
  constructor(
    @inject(TYPES.ApplicationRepository)
    private readonly _applicationRepo: IApplicationRepository,

    @inject(TYPES.MediaService)
    private readonly _mediaService: IMediaService,
    @inject(TYPES.NotificationService)
    private readonly _notificationService: INotificationService,
    @inject(TYPES.JobRepository) private readonly _jobRepo: IJobRepository
  ) {}

  async getApplicationWithDetails(
    applicationId: string
  ): Promise<ApplicationResponseDTO | null> {
    const doc = await this._applicationRepo.findByIdWithUserAndJob(
      applicationId
    );
    const newProfilePictureSignedUrl = doc?.user.profilePicture
      ? await this._mediaService.getMediaUrl(doc?.user.profilePicture)
      : "";
    if (!doc) return null;

    const dto = ApplicationMapper.toUserAndJobDTO(
      doc,
      newProfilePictureSignedUrl
    );

    if (doc.resumeMediaId) {
      const media = await this._mediaService.getMediaById(
        doc.resumeMediaId.toString()
      );
      if (media?.s3Key) {
        const resumeUrl = await this._mediaService.getMediaUrl(media.s3Key);
        return { ...dto, resumeUrl };
      }
    }

    return dto;
  }

  async updateApplicationStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    reason?: string
  ): Promise<IApplication | null> {
    const application = await this._applicationRepo.findById(applicationId);
    if (!application) return null;
    const { user, job } = application;
    const jobData = await this._jobRepo.findById(job.toString());

    if (!jobData) {
      throw new Error(COMMON_MESSAGES.JOB_NOT_FOUND);
    }
    const currentStatus = application.status;
    const allowed = allowedTransitions[currentStatus];
    if (!allowed.includes(newStatus)) {
      throw new Error(
        `Invalid status transition from ${currentStatus} to ${newStatus}`
      );
    }

    const statusesRequiringReason: ApplicationStatus[] = [
      ApplicationStatus.REJECTED,
      ApplicationStatus.INTERVIEW_CANCELLED,
      ApplicationStatus.INTERVIEW_REJECTED_BY_USER,
      ApplicationStatus.WITHDRAWN,
    ];

    if (statusesRequiringReason.includes(newStatus) && !reason) {
      throw new Error(`Reason is required for status: ${newStatus}`);
    }
    await this._notificationService.sendNotification(
      user.toString(),
      `application status updated for ${jobData.title} and status is ${newStatus}`,
      NotificationType.JOB,
      jobData.company.toString()
    );

    return this._applicationRepo.updateStatus(applicationId, newStatus, reason);
  }
}
