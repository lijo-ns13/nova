import mongoose, { Schema } from "mongoose";
import { IJob } from "../repositories/entities/job.entity";
import { JobType } from "../constants/job.constant";
import { EmploymentType } from "../constants/employeeType.constant";
import { ExperienceLevel } from "../constants/experience.constant";

const JobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 5000,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    jobType: {
      type: String,
      enum: Object.values(JobType),
      required: true,
    },
    employmentType: {
      type: String,
      enum: Object.values(EmploymentType),
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: Object.values(ExperienceLevel),
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    skillsRequired: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
        required: true,
      },
    ],
    salary: {
      currency: {
        type: String,
        default: "USD",
        required: true,
      },
      min: {
        type: Number,
        required: true,
        min: 0,
      },
      max: {
        type: Number,
        required: true,
        validate: {
          validator: function (this: IJob, value: number) {
            return value >= this.salary.min;
          },
          message: "Maximum salary must be ≥ minimum salary",
        },
      },
      isVisibleToApplicants: {
        type: Boolean,
        default: true,
      },
    },
    benefits: {
      type: [String],
      required: true,
      validate: {
        validator: (val: string[]) => val.length > 0,
        message: "At least one benefit is required",
      },
    },
    perks: {
      type: [String],
    },
    applicationDeadline: {
      type: Date,
      required: true,
      validate: {
        validator: function (this: IJob, value: Date) {
          return value > new Date();
        },
        message: "Deadline must be in the future",
      },
    },
    status: {
      type: String,
      enum: ["open", "closed", "filled"],
      default: "open",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

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
