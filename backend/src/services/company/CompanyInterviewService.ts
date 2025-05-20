// src/modules/job/services/JobService.ts
import { inject } from "inversify";
import { TYPES } from "../../di/types";
import { IApplicationRepository } from "../../interfaces/repositories/IApplicationRepository";
import { IInterviewRepository } from "../../core/entities/interview.interface";

export class CompanyInterviewService implements ICompanyInterviewService {
  constructor(
    @inject(TYPES.InterviewRepository)
    private _interviewRepo: IInterviewRepository,
    @inject(TYPES.ApplicationRepository)
    private _applicationRepo: IApplicationRepository
  ) {}

  async createInterview(
    companyId: string,
    userId: string,
    applicationId: string,
    scheduledAt: string,
    roomId: string
  ): Promise<IInterview> {
    // Check for existing interview at this time
    const existingInterview = await this._interviewRepo.findByTimeSlot(
      companyId,
      new Date(scheduledAt)
    );

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

    return interview;
  }

  async getComanyInterviews(companyId: string): Promise<IInterview[]> {
    return this._interviewRepo.findByCompanyId(companyId);
  }
}
