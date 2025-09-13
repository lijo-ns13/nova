import mongoose from "mongoose";
import { JobSchema } from "../schema/job.schema";
import { IJob } from "../entities/job.entity";

// Virtual for application count
JobSchema.virtual("applicationCount", {
  ref: "Application",
  localField: "_id",
  foreignField: "job",
  count: true,
});

// Indexes
JobSchema.index({ title: "text", description: "text" });
JobSchema.index({ company: 1, status: 1 });
JobSchema.index({ "salary.min": 1, "salary.max": 1 });
JobSchema.index({ applicationDeadline: 1 });
JobSchema.index({ createdAt: -1 });

// Pre-save validation
JobSchema.pre<IJob>("save", function (next) {
  if (this.salary.min > this.salary.max) {
    throw new Error("Minimum salary cannot be greater than maximum salary");
  }
  next();
});

export default mongoose.model<IJob>("Job", JobSchema);
