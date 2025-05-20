import { Document } from "mongoose";

export interface IInterview {
  companyId: string;
  userId: string;
  applicationId: string;
  scheduledAt: Date;
  roomId: string;
  result?: "pass" | "fail";
}

export interface IInterviewDocument extends IInterview, Document {}

export interface IInterviewResult {
  result: "pass" | "fail";
}

export interface IScheduleInterview {
  companyId: string;
  userId: string;
  applicationId: string;
  scheduledAt: Date;
}

export interface IInterviewService {
  scheduleInterview(data: IScheduleInterview): Promise<IInterviewDocument>;
  markInterviewResult(
    id: string,
    result: "pass" | "fail"
  ): Promise<IInterviewDocument | null>;
  getCompanyInterviews(companyId: string): Promise<IInterviewDocument[]>;
}

export interface IInterviewRepository {
  create(data: IInterview): Promise<IInterviewDocument>;
  findByIdAndUpdate(
    id: string,
    update: Partial<IInterview>
  ): Promise<IInterviewDocument | null>;
  findByCompanyId(companyId: string): Promise<IInterviewDocument[]>;
  findByCompanyAndTime(
    companyId: string,
    scheduledAt: Date
  ): Promise<IInterviewDocument | null>;
}
