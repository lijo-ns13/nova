// src/modules/job/services/JobService.ts
import { inject } from "inversify";
import { TYPES } from "../../di/types";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import {
  IInterview,
  InterviewResponse,
} from "../../core/entities/interview.interface";

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

export class CompanyInterviewService implements ICompanyInterviewService {
  constructor(
    @inject(TYPES.InterviewRepository)
    private _interviewRepo: IInterviewRepository,
    @inject(TYPES.ApplicationRepository)
    private _applicationRepo: IApplicationRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService,
    @inject(TYPES.CompanyRepository) private _companyRepo: ICompanyRepository,
    @inject(TYPES.JobRepository) private _jobRepo: IJobRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
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

    const jobId =
      typeof applicant.job === "string"
        ? applicant.job
        : applicant.job instanceof Types.ObjectId
        ? applicant.job.toString()
        : applicant.job._id?.toString(); // when populated
    if (!jobId) {
      throw new Error("jobid not found");
    }
    const job = await this._jobRepo.findById(jobId);
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
    const company = await this._companyRepo.findById(companyId);
    if (!company) {
      throw new Error("company not found");
    }
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
      `An interview has been scheduled by ${company.companyName} for the position of "${job?.title}". Please respond to proceed.`,
      NotificationType.JOB,
      companyId
    );

    return interview;
  }
  // src/modules/job/services/JobService.ts
  async getUpcomingAcceptedInterviews(
    companyId: string
  ): Promise<InterviewResponse[]> {
    const interviews = await this._interviewRepo.findByCompanyIdforPop(
      companyId
    );

    const response: InterviewResponse[] = [];

    for (const interview of interviews) {
      let applicationId: string;

      if (
        typeof interview.applicationId === "object" &&
        interview.applicationId !== null &&
        "_id" in interview.applicationId
      ) {
        applicationId = interview.applicationId._id.toString();
      } else {
        applicationId = interview.applicationId?.toString();
      }
      if (!applicationId) continue;

      const application = await this._applicationRepo.findById(applicationId);
      if (!application) continue;

      // Fetch user and job from repositories
      const userId =
        typeof application.user === "string"
          ? application.user
          : application.user instanceof Types.ObjectId
          ? application.user.toString()
          : application.user._id?.toString();

      const jobId =
        typeof application.job === "string"
          ? application.job
          : application.job instanceof Types.ObjectId
          ? application.job.toString()
          : application.job._id?.toString();

      const user = await this._userRepo.findById(userId);
      if (!user) {
        throw new Error("user not found");
      }
      if (!jobId) {
        throw new Error("jobid not found");
      }
      const job = await this._jobRepo.findById(jobId);
      if (!job) {
        throw new Error("job not found");
      }
      response.push({
        roomId: interview.roomId,
        interviewTime: interview.scheduledAt,
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
        },
        job: {
          _id: job._id.toString(),
          title: job.title,
          description: job.description,
          location: job.location,
          jobType: job.jobType,
        },
        applicationId: applicationId,
      });
    }

    return response;
  }
}
