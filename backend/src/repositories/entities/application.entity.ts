import { Document, Types } from "mongoose";
import { ApplicationStatus } from "../../core/enums/applicationStatus";
export interface IStatusHistory {
  status: ApplicationStatus;
  changedAt: Date;
  reason?: string;
}
export interface IApplication extends Document {
  _id: Types.ObjectId;
  job: Types.ObjectId;
  user: Types.ObjectId;
  appliedAt: Date;
  resumeMediaId: Types.ObjectId;
  coverLetter?: string;
  status: ApplicationStatus;
  notes?: string;
  scheduledAt?: Date;
  statusHistory: IStatusHistory[];
}
