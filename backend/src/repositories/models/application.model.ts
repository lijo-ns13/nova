import mongoose from "mongoose";
import { ApplicationSchema } from "../schema/application.schema";
import { IApplication } from "../entities/application.entity";

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
