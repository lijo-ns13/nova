// src/interfaces/services/ICompanyInterviewService.ts
import { InterviewResponse } from "../../core/entities/interview.interface";
import { IApplication } from "../../models/application.modal";
import { IInterview } from "../../models/interview.modal";

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
  proposeReschedule(
    companyId: string,
    applicationId: string,
    reason: string,
    timeSlots: string[]
  ): Promise<IInterview>;
}
