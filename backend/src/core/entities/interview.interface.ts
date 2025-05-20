import { Document } from "mongoose";

export interface IInterview {
  _id: any;
  companyId: string;
  userId: string;
  applicationId: string;
  scheduledAt: Date;
  roomId: string;
  result?: "pending" | "pass" | "fail";
}

// export interface IInterviewDocument extends IInterview, Document {}

export interface IInterviewResult {
  result: "pass" | "fail";
}

export interface IScheduleInterview {
  companyId: string;
  userId: string;
  applicationId: string;
  scheduledAt: Date;
}
