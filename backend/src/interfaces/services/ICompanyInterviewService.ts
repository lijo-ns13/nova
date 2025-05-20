// src/interfaces/services/ICompanyInterviewService.ts
import { IInterview } from "../../core/entities/interview.interface";

export interface ICompanyInterviewService {
  createInterview(
    companyId: string,
    userId: string,
    applicationId: string,
    scheduledAt: string,
    roomId: string
  ): Promise<IInterview>;

  getComanyInterviews(companyId: string): Promise<IInterview[]>;
}
