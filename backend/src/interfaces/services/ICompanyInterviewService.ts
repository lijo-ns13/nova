// src/interfaces/services/ICompanyInterviewService.ts
import {
  IInterview,
  InterviewResponse,
} from "../../core/entities/interview.interface";
import { IApplication } from "../../models/application.modal";

export interface ICompanyInterviewService {
  createInterview(
    companyId: string,
    userId: string,
    applicationId: string,
    scheduledAt: string,
    roomId: string
  ): Promise<IInterview>;
  getUpcomingAcceptedInterviews(
    companyId: string
  ): Promise<InterviewResponse[]>;
}
