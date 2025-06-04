// src/modules/job/services/JobService.ts
import { inject } from "inversify";
import { TYPES } from "../../di/types";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { IInterview } from "../../core/entities/interview.interface";

import { ICompanyInterviewService } from "../../interfaces/services/ICompanyInterviewService";
import { IInterviewRepository } from "../../interfaces/repositories/IInterviewRepository";
import {
  ApplicationStatus,
  IApplication,
} from "../../models/application.modal";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { NotificationType } from "../../models/notification.modal";
import { IJob } from "../../models/job.modal";

export class CompanyInterviewService implements ICompanyInterviewService {
  constructor(
    @inject(TYPES.InterviewRepository)
    private _interviewRepo: IInterviewRepository,
    @inject(TYPES.ApplicationRepository)
    private _applicationRepo: IApplicationRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService
  ) {}

  async createInterview(
    companyId: string,
    userId: string,
    applicationId: string,
    scheduledAt: string,
    roomId: string
  ): Promise<any> {
    // Check for existing interview at this time
    const applicant = await this._applicationRepo.findById(applicationId);
    console.log("applicantttttttttttttttttttt", applicant);
    if (!applicant) {
      throw new Error("applicnat not found");
    }
    if (applicant.status != "shortlisted") {
      throw new Error("only shedule interview for shortlisted application");
    }

    const existingInterview = await this._interviewRepo.findByTimeSlot(
      companyId,
      new Date(scheduledAt)
    );
    const alreadyCreatedInterview =
      await this._interviewRepo.findByCompanyIdApplicantId(
        companyId,
        applicationId
      );
    if (alreadyCreatedInterview) {
      throw new Error("you already created interview for this applicant");
    }
    if (existingInterview) {
      throw new Error(
        "Conflict: Company already has an interview at this time."
      );
    }

    // Create new interview
    const interview = await this._interviewRepo.create({
      companyId,
      userId,
      applicationId,
      scheduledAt: new Date(scheduledAt),
      roomId,
      status: "pending",
      result: "pending",
    });

    // Update application status
    await this._applicationRepo.updateStatus(
      applicationId,
      ApplicationStatus.INTERVIEW_SCHEDULED
    );
    await this._applicationRepo.update(applicationId, {
      scheduledAt: interview.scheduledAt,
    });
    await this.notificationService.sendNotification(
      userId,
      `Interview Sheduled,Please check job status`,
      NotificationType.JOB,
      companyId
    );
    return interview;
  }

  async getComanyInterviews(companyId: string): Promise<any> {
    return this._interviewRepo.findByCompanyId(companyId);
  }
  async getApplicationInterviews(
    applicationId: string,
    companyId: string
  ): Promise<any> {
    const interview = await this._interviewRepo.findOne({
      applicationId: applicationId,
    });
    if (interview?.companyId != companyId) {
      throw new Error("only get own ocmpany interviews");
    }
    return interview;
  }
  async getApplicantDetails(
    applicationId: string,
    companyId: string
  ): Promise<IApplication | null> {
    const application = await this._applicationRepo.findByIdWithUserAndJob(
      applicationId
    );
    console.log("applicaiotn", application);
    if (!application) {
      throw new Error("Application not found");
    }

    const job = application.job as IJob;

    if (job.company.toString() !== companyId.toString()) {
      throw new Error(
        "You're not authorized to view another company's application"
      );
    }

    return application;
  }
}
