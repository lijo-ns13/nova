import { Schema } from "mongoose";
import { ApplicationStatus } from "../../core/enums/applicationStatus";
import { IApplication, IStatusHistory } from "../entities/application.entity";

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

export const ApplicationSchema = new Schema<IApplication>(
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
