// src/shared/models/application.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "./user.modal";
import { IJob } from "./job.modal";

export enum ApplicationStatus {
  // Initial stages
  APPLIED = "applied",
  SHORTLISTED = "shortlisted",
  REJECTED = "rejected",

  // Interview process
  INTERVIEW_SCHEDULED = "interview_scheduled",
  INTERVIEW_CANCELLED = "interview_cancelled",

  INTERVIEW_ACCEPTED_BY_USER = "interview_accepted_by_user",
  INTERVIEW_REJECTED_BY_USER = "interview_rejected_by_user",

  INTERVIEW_COMPLETED = "interview_completed",
  INTERVIEW_PASSED = "interview_passed",
  INTERVIEW_FAILED = "interview_failed",

  // Offer process
  OFFERED = "offered",

  // Final status
  SELECTED = "selected", // Final hiring decision
  HIRED = "hired", // Officially onboarded
  WITHDRAWN = "withdrawn", // Candidate withdrew
}

export interface IStatusHistory {
  status: ApplicationStatus;
  changedAt: Date;
  reason?: string;
}

export interface IApplication extends Document {
  job: Types.ObjectId | IJob | string;
  user: Types.ObjectId | IUser | string;
  appliedAt: Date;
  resumeMediaId: Types.ObjectId | string;
  coverLetter?: string;
  status: ApplicationStatus;
  notes?: string;
  scheduledAt?: Date;
  statusHistory: IStatusHistory[];
}

const StatusHistorySchema = new Schema<IStatusHistory>(
  {
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      maxlength: 1000,
    },
  },
  { _id: false }
);

const ApplicationSchema = new Schema<IApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    resumeMediaId: {
      type: Schema.Types.ObjectId,
      ref: "Media",
      required: true,
    },
    coverLetter: {
      type: String,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: Object.values(ApplicationStatus),
      default: ApplicationStatus.APPLIED,
      index: true,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
    scheduledAt: {
      type: Date,
    },
    statusHistory: {
      type: [StatusHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate applications
ApplicationSchema.index({ job: 1, user: 1 }, { unique: true });

// Common query optimizations
ApplicationSchema.index({ status: 1, appliedAt: -1 });
ApplicationSchema.index({ job: 1, status: 1 });
ApplicationSchema.index({ user: 1, status: 1 });

// Virtuals
ApplicationSchema.virtual("jobDetails", {
  ref: "Job",
  localField: "job",
  foreignField: "_id",
  justOne: true,
});

ApplicationSchema.virtual("userDetails", {
  ref: "User",
  localField: "user",
  foreignField: "_id",
  justOne: true,
});

export default mongoose.model<IApplication>("Application", ApplicationSchema);
