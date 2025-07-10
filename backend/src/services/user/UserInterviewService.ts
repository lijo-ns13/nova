// src/modules/job/services/UserInterviewService.ts
import { inject } from "inversify";
import { TYPES } from "../../di/types";

import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import {
  ApplicationStatus,
  IApplication,
} from "../../models/application.modal";
import { IUserInterviewService } from "../../interfaces/services/IUserInterviewService";
import { IInterviewRepository } from "../../interfaces/repositories/IInterviewRepository";
import { IInterview } from "../../core/entities/interview.interface";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { NotificationType } from "../../models/notification.modal";
import { IJobRepository } from "../../interfaces/repositories/IJobRepository";
import { Types } from "mongoose";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IEmailService } from "../../interfaces/services/IEmailService";
import logger from "../../utils/logger";
import {
  ApplicationMapper,
  ApplicationStatusResponseDTO,
} from "../../mapping/user/userapplication.mapper";
export class UserInterviewService implements IUserInterviewService {
  private logger = logger.child({ context: "userinterviewService" });
  constructor(
    @inject(TYPES.ApplicationRepository)
    private _applicationRepo: IApplicationRepository,
    @inject(TYPES.InterviewRepository)
    private _interviewRepo: IInterviewRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService,
    @inject(TYPES.JobRepository) private _jobRepo: IJobRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.EmailService) private _emailService: IEmailService
  ) {}
  async findInterview(applicationId: string, userId: string): Promise<any> {
    return this._interviewRepo.findOne({ applicationId, userId });
  }
  async updateStatus(
    applicationId: string,
    status: ApplicationStatus,
    email?: string
  ): Promise<ApplicationStatusResponseDTO> {
    if (
      status !== ApplicationStatus.INTERVIEW_REJECTED_BY_USER &&
      status !== ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER
    ) {
      throw new Error("Only user can accept or reject interview");
    }

    const application = await this._applicationRepo.findById(applicationId);
    console.log("application", application, "jlkdsf");
    if (!application) {
      throw new Error("Application not found");
    }
    const userId = application.user;

    if (!userId) {
      throw new Error("userId not found");
    }
    const user = await this._userRepo.findById(userId.toString());
    if (!user) {
      throw new Error("user not found");
    }
    const { name, _id } = user;
    const jobId = application.job;
    console.log("jobid", jobId);
    if (!jobId) {
      throw new Error("jobId not found");
    }
    const job = await this._jobRepo.findById(jobId.toString());
    console.log(job, "jobdatajlkdsfjlkdsfjlkdsfjlkdfsjlk");
    const companyId = job?.company;
    if (!companyId) {
      throw new Error("companyId not found");
    }
    await this.notificationService.sendNotification(
      companyId.toString(),
      `${name} has responded to the interview with status: ${status
        .replaceAll("_", " ")
        .toLowerCase()}`,
      NotificationType.JOB,
      _id.toString()
    );

    // 💡 Send interview link email when user accepts interview
    if (status === ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER && email) {
      const interview = await this._interviewRepo.findOne({
        applicationId,
        userId,
      });
      if (!interview) {
        throw new Error("Interview not found for this application");
      }

      await this._emailService.sendInterviewLink(
        email,
        interview.roomId,
        interview.scheduledAt
      );
    }
    const updated = await this._applicationRepo.updateStatus(
      applicationId,
      status
    );
    if (!updated) {
      throw new Error("Application failed updation");
    }
    return ApplicationMapper.toStatusResponseDTO(updated);
  }
  // In UserInterviewService.ts

  async handleRescheduleResponse(
    applicationId: string,
    status: ApplicationStatus,
    selectedSlot?: string,
    email?: string
  ): Promise<ApplicationStatusResponseDTO> {
    const application = await this._applicationRepo.findById(applicationId);
    if (!application) throw new Error("Application not found");

    const user = await this._userRepo.findById(application.user.toString());
    if (!user) throw new Error("User not found");

    const job = await this._jobRepo.findById(application.job.toString());
    if (!job) throw new Error("Job not found");

    const companyId = job.company;
    if (!companyId) throw new Error("Company ID not found");

    const interview = await this._interviewRepo.findOne({
      applicationId,
      userId: user._id,
      status: "reschedule_proposed",
    });
    if (!interview) throw new Error("No reschedule proposal found");

    let updatedApp: IApplication | null = null;

    if (status === ApplicationStatus.INTERVIEW_RESCHEDULE_ACCEPTED) {
      if (!selectedSlot) {
        throw new Error("Selected slot is required when accepting reschedule");
      }

      const selectedDate = new Date(selectedSlot);
      const isSlotValid = interview.rescheduleProposedSlots?.some(
        (slot) => slot.getTime() === selectedDate.getTime()
      );

      if (!isSlotValid) {
        throw new Error("Selected slot is not one of the proposed slots");
      }

      await this._interviewRepo.update(interview._id.toString(), {
        status: "accepted",
        scheduledAt: selectedDate,
        rescheduleSelectedSlot: selectedDate,
      });

      updatedApp = await this._applicationRepo.update(applicationId, {
        status: ApplicationStatus.INTERVIEW_RESCHEDULE_ACCEPTED,
        scheduledAt: selectedDate,
        $push: {
          statusHistory: {
            status: ApplicationStatus.INTERVIEW_RESCHEDULE_ACCEPTED,
            changedAt: new Date(),
            reason: "User accepted rescheduled time slot",
          },
        },
      });

      await this.notificationService.sendNotification(
        companyId.toString(),
        `${
          user.name
        } has accepted the rescheduled interview time (${selectedDate.toISOString()})`,
        NotificationType.JOB,
        user._id.toString()
      );

      if (email) {
        await this._emailService.sendInterviewLink(
          email,
          interview.roomId,
          selectedDate
        );
      }
    } else if (status === ApplicationStatus.INTERVIEW_RESCHEDULE_REJECTED) {
      await this._interviewRepo.update(interview._id.toString(), {
        status: "rejected",
      });

      updatedApp = await this._applicationRepo.update(applicationId, {
        status: ApplicationStatus.INTERVIEW_RESCHEDULE_REJECTED,
        $push: {
          statusHistory: {
            status: ApplicationStatus.INTERVIEW_RESCHEDULE_REJECTED,
            changedAt: new Date(),
            reason: "User rejected rescheduled time slots",
          },
        },
      });

      await this.notificationService.sendNotification(
        companyId.toString(),
        `${user.name} has rejected the proposed interview reschedule times.`,
        NotificationType.JOB,
        user._id.toString()
      );
    } else {
      throw new Error("Invalid status for reschedule response");
    }

    if (!updatedApp) {
      throw new Error("Application update failed");
    }

    return ApplicationMapper.toStatusResponseDTO(updatedApp);
  }

  async getRescheduleProposedSlots(
    applicationId: string,
    userId: string
  ): Promise<Date[] | null> {
    const interview = await this._interviewRepo.findOne({
      applicationId,
      userId,
      status: "reschedule_proposed",
    });

    if (!interview) {
      return null;
    }

    return interview.rescheduleProposedSlots ?? null;
  }
}
