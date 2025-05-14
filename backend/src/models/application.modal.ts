// src/shared/models/application.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";
import { ApplicationStatus } from "./job.modal";
import { IUser } from "./user.modal";
import { IJob } from "./job.modal";

export interface IApplication extends Document {
  job: Types.ObjectId | IJob;
  user: Types.ObjectId | IUser;
  appliedAt: Date;
  resumeUrl: string;
  coverLetter?: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  notes?: string;
}

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
    resumeUrl: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => v.startsWith("http"),
        message: "Resume URL must be a valid link",
      },
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
