// src/shared/models/application.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";
import { ApplicationStatus } from "./job.modal";
import { IUser } from "./user.modal";
import { IJob } from "./job.modal";
import container from "../di/container";
import { IMediaService } from "../interfaces/services/Post/IMediaService";
import { TYPES } from "../di/types";

export interface IApplication extends Document {
  job: Types.ObjectId | IJob | string;
  user: Types.ObjectId | IUser | string;
  appliedAt: Date;
  resumeMediaId: Types.ObjectId | string;
  coverLetter?: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  notes?: string;
  scheduledAt?: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    scheduledAt: {
      type: Date,
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
      // Changed field name and type
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
    rejectionReason: {
      type: String,
      maxlength: 500,
    },
    notes: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index to prevent duplicate applications
ApplicationSchema.index({ job: 1, user: 1 }, { unique: true });

// Indexes for common query patterns
ApplicationSchema.index({ status: 1, appliedAt: -1 });
ApplicationSchema.index({ job: 1, status: 1 });
ApplicationSchema.index({ user: 1, status: 1 });

// Virtual population
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
