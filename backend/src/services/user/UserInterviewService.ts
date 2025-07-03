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

export class UserInterviewService implements IUserInterviewService {
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
  ): Promise<IApplication | null> {
    const application = await this._applicationRepo.findById(applicationId);
    if (!application) {
      throw new Error("Application not found");
    }
    const userId =
      typeof application.user === "string"
        ? application.user
        : application.user instanceof Types.ObjectId
        ? application.user.toString()
        : application.user._id?.toString(); // when populated

    if (!userId) {
      throw new Error("userId not found");
    }
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    const { name, _id } = user;
    const jobId =
      typeof application.job === "string"
        ? application.job
        : application.job instanceof Types.ObjectId
        ? application.job.toString()
        : application.job._id?.toString(); // when populated

    if (!jobId) {
      throw new Error("jobId not found");
    }
    const job = await this._jobRepo.findById(jobId);
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
    return this._applicationRepo.updateStatus(applicationId, status);
  }
  // In UserInterviewService.ts

  async handleRescheduleResponse(
    applicationId: string,
    status: ApplicationStatus,
    selectedSlot?: string,
    email?: string
  ): Promise<IApplication | null> {
    const application = await this._applicationRepo.findById(applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    const userId =
      typeof application.user === "string"
        ? application.user
        : application.user instanceof Types.ObjectId
        ? application.user.toString()
        : application.user._id?.toString();

    if (!userId) {
      throw new Error("userId not found");
    }

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }

    const { name, _id } = user;
    const jobId =
      typeof application.job === "string"
        ? application.job
        : application.job instanceof Types.ObjectId
        ? application.job.toString()
        : application.job._id?.toString();

    if (!jobId) {
      throw new Error("jobId not found");
    }

    const job = await this._jobRepo.findById(jobId);
    const companyId = job?.company;
    if (!companyId) {
      throw new Error("companyId not found");
    }

    // Update application status
    const updatedApp = await this._applicationRepo.updateStatus(
      applicationId,
      status
    );

    // Find the interview
    const interview = await this._interviewRepo.findOne({
      applicationId,
      userId,
      status: "reschedule_proposed",
    });

    if (!interview) {
      throw new Error("No reschedule proposal found for this interview");
    }

    if (status === ApplicationStatus.INTERVIEW_RESCHEDULE_ACCEPTED) {
      if (!selectedSlot) {
        throw new Error("Selected slot is required when accepting reschedule");
      }

      // Validate selected slot is one of the proposed slots
      const selectedDate = new Date(selectedSlot);
      const isSlotValid = interview.rescheduleProposedSlots?.some(
        (slot) => slot.getTime() === selectedDate.getTime()
      );

      if (!isSlotValid) {
        throw new Error("Selected slot is not one of the proposed slots");
      }

      // Update interview with selected slot
      await this._interviewRepo.update(interview._id.toString(), {
        status: "accepted",
        scheduledAt: selectedDate,
        rescheduleSelectedSlot: selectedDate,
      });

      // Update scheduledAt in application
      await this._applicationRepo.update(applicationId, {
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

      // Notify company
      await this.notificationService.sendNotification(
        companyId.toString(),
        `${name} has accepted the rescheduled interview time (${selectedDate}).`,
        NotificationType.JOB,
        _id.toString()
      );

      // Send email with new interview details
      if (email) {
        await this._emailService.sendInterviewLink(
          email,
          interview.roomId,
          selectedDate
        );
      }
    } else if (status === ApplicationStatus.INTERVIEW_RESCHEDULE_REJECTED) {
      // Update interview status
      await this._interviewRepo.update(interview._id.toString(), {
        status: "rejected",
      });
      await this._applicationRepo.update(applicationId, {
        status: ApplicationStatus.INTERVIEW_RESCHEDULE_REJECTED,
        $push: {
          statusHistory: {
            status: ApplicationStatus.INTERVIEW_RESCHEDULE_REJECTED,
            changedAt: new Date(),
            reason: "User rejected rescheduled time slots",
          },
        },
      });
      // Notify company
      await this.notificationService.sendNotification(
        companyId.toString(),
        `${name} has rejected the proposed interview reschedule times.`,
        NotificationType.JOB,
        _id.toString()
      );
    }

    return updatedApp;
  }
  async getRescheduleProposedSlots(
    applicationId: string,
    userId: string
  ): Promise<Date[] | null> {
    console.log(applicationId, userId, "lkjds");
    const interview = await this._interviewRepo.findOne({
      applicationId: applicationId,
      userId: userId,
      status: "reschedule_proposed",
    });
    console.log("user interview", interview);
    if (!interview) {
      return null;
    }

    return interview.rescheduleProposedSlots || null;
  }
}
