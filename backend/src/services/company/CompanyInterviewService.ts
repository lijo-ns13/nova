// src/modules/job/services/JobService.ts
import { inject } from "inversify";
import { TYPES } from "../../di/types";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { InterviewResponse } from "../../core/entities/interview.interface";
import { v4 as uuidv4 } from "uuid";
import { ICompanyInterviewService } from "../../interfaces/services/ICompanyInterviewService";
import { IInterviewRepository } from "../../interfaces/repositories/IInterviewRepository";
import {
  ApplicationStatus,
  IApplication,
} from "../../models/application.modal";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { NotificationType } from "../../models/notification.modal";
import { IJob } from "../../models/job.modal";
import { ICompanyRepository } from "../../interfaces/repositories/ICompanyRepository";
import { IJobRepository } from "../../interfaces/repositories/IJobRepository";
import { Types } from "mongoose";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IInterview } from "../../models/interview.modal";
import {
  InterviewMapper,
  InterviewResponseDTO,
  UpcomingInterviewResponseDTO,
} from "../../mapping/company/interview.mapper";
import {
  CreateInterviewInput,
  ProposeRescheduleInput,
} from "../../core/dtos/company/interview.dto";

export class CompanyInterviewService implements ICompanyInterviewService {
  constructor(
    @inject(TYPES.InterviewRepository)
    private _interviewRepo: IInterviewRepository,
    @inject(TYPES.ApplicationRepository)
    private _applicationRepo: IApplicationRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
    @inject(TYPES.CompanyRepository) private _companyRepo: ICompanyRepository,
    @inject(TYPES.JobRepository) private _jobRepo: IJobRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}
  async createInterview(
    input: CreateInterviewInput
  ): Promise<InterviewResponseDTO> {
    const { companyId, userId, applicationId, jobId, scheduledAt } = input;

    const application = await this._applicationRepo.findById(applicationId);
    if (!application) throw new Error("Application not found");
    if (application.status !== ApplicationStatus.SHORTLISTED) {
      throw new Error(
        "Only shortlisted applications can be scheduled for interviews"
      );
    }
    if (application.job.toString() !== jobId) {
      throw new Error("Job ID mismatch for the application");
    }

    const existing = await this._interviewRepo.findByTimeSlot(
      companyId,
      new Date(scheduledAt)
    );
    if (existing) {
      throw new Error("Company already has an interview at this time");
    }

    const duplicate = await this._interviewRepo.findByCompanyIdApplicantId(
      companyId,
      applicationId
    );
    if (duplicate) {
      throw new Error("Interview already exists for this application");
    }
    const roomId: string = uuidv4();
    const interview = await this._interviewRepo.create({
      companyId,
      userId,
      applicationId,
      scheduledAt: new Date(scheduledAt),
      roomId: roomId,
      status: "pending",
      result: "pending",
    });

    await this._applicationRepo.updateStatus(
      applicationId,
      ApplicationStatus.INTERVIEW_SCHEDULED
    );
    await this._applicationRepo.update(applicationId, {
      scheduledAt: interview.scheduledAt,
    });

    const company = await this._companyRepo.findById(companyId);
    const job = await this._jobRepo.findById(jobId);

    await this._notificationService.sendNotification(
      userId,
      `An interview has been scheduled by ${company?.companyName} for the position of \"${job?.title}\". Please respond to proceed.`,
      NotificationType.JOB,
      companyId
    );

    return InterviewMapper.toDTO(interview);
  }

  async proposeReschedule(
    input: ProposeRescheduleInput
  ): Promise<InterviewResponseDTO> {
    const { companyId, applicationId, jobId, reason, timeSlots } = input;

    const interview = await this._interviewRepo.findOne({
      companyId,
      applicationId,
    });
    if (!interview) throw new Error("Interview not found");

    const application = await this._applicationRepo.findById(applicationId);
    if (!application) throw new Error("Application not found");

    if (
      application.status !== ApplicationStatus.INTERVIEW_SCHEDULED &&
      application.status !== ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER
    ) {
      throw new Error("Cannot propose reschedule at this status");
    }

    if (application.job.toString() !== jobId) {
      throw new Error("Job ID mismatch for the application");
    }

    const parsedSlots = timeSlots.map((slot) => new Date(slot));
    for (const slot of parsedSlots) {
      const conflict =
        await this._interviewRepo.findConflictingInterviewSlotIncludingProposals(
          companyId,
          slot,
          interview._id.toString()
        );
      if (conflict) {
        throw new Error(
          `Conflict with another interview at ${slot.toISOString()}`
        );
      }
    }

    const updated = await this._interviewRepo.update(interview._id.toString(), {
      status: "reschedule_proposed",
      rescheduleProposedSlots: parsedSlots,
      rescheduleReason: reason,
    });
    if (!updated) throw new Error("Failed to update interview");

    await this._applicationRepo.updateStatus(
      applicationId,
      ApplicationStatus.INTERVIEW_RESCHEDULE_PROPOSED
    );

    const job = await this._jobRepo.findById(jobId);
    await this._notificationService.sendNotification(
      application.user.toString(),
      `The company has proposed new interview slots for \"${job?.title}\". Please respond.`,
      NotificationType.JOB,
      companyId
    );

    return InterviewMapper.toDTO(updated);
  }

  async getUpcomingAcceptedInterviews(
    companyId: string
  ): Promise<IInterview[]> {
    const interviews = await this._interviewRepo.findByCompanyIdforPop(
      companyId
    );
    return interviews;
  }
}
function uuid4() {
  throw new Error("Function not implemented.");
}
