// src/shared/models/job.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "./user.modal";
import { ICompany } from "./company.modal";

export enum EmploymentType {
  FULL_TIME = "full-time",
  PART_TIME = "part-time",
  CONTRACT = "contract",
  TEMPORARY = "temporary",
  INTERNSHIP = "internship",
  FREELANCE = "freelance",
}
// export enum ApplicationStatus {
//   APPLIED = "applied",
//   SHORTLISTED = "shortlisted",
//   REJECTED = "rejected",

//   INTERVIEW_SCHEDULED = "interview_scheduled",
//   INTERVIEW_CANCELLED = "interview_cancelled",

//   INTERVIEW_ACCEPTED_BY_USER = "interview_accepted_by_user",
//   INTERVIEW_REJECTED_BY_USER = "interview_rejected_by_user",

//   INTERVIEW_FAILED = "interview_failed",
//   INTERVIEW_PASSED = "interview_passed",

//   OFFERED = "offered",
//   SELECTED = "selected",

//   WITHDRAWN = "withdrawn",
// }
export enum ApplicationStatus {
  // Initial stages
  APPLIED = "applied",
  SHORTLISTED = "shortlisted",
  REJECTED = "rejected",

  // Interview process
  INTERVIEW_SCHEDULED = "interview_scheduled",
  INTERVIEW_RESCHEDULED = "interview_rescheduled",
  INTERVIEW_CANCELLED = "interview_cancelled",

  INTERVIEW_ACCEPTED_BY_USER = "interview_accepted_by_user",
  INTERVIEW_REJECTED_BY_USER = "interview_rejected_by_user",

  INTERVIEW_COMPLETED = "interview_completed",
  INTERVIEW_PASSED = "interview_passed",
  INTERVIEW_FAILED = "interview_failed",

  // Offer process
  OFFERED = "offered",
  OFFER_ACCEPTED = "offer_accepted",
  OFFER_REJECTED = "offer_rejected",

  // Final status
  SELECTED = "selected", // Final hiring decision
  HIRED = "hired", // Officially onboarded
  WITHDRAWN = "withdrawn", // Candidate withdrew from the process
}

export enum JobType {
  REMOTE = "remote",
  HYBRID = "hybrid",
  ON_SITE = "on-site",
}

export enum ExperienceLevel {
  ENTRY = "entry",
  MID = "mid",
  SENIOR = "senior",
  LEAD = "lead",
}

export interface SalaryRange {
  currency: string;
  min: number;
  max: number;
  isVisibleToApplicants: boolean;
}

export interface IJob extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  location: string;
  jobType: JobType;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  company: Types.ObjectId | ICompany;
  skillsRequired: Types.ObjectId[];
  salary: SalaryRange;
  benefits: string[];
  perks?: string[];
  applicationDeadline: Date;
  status: "open" | "closed" | "filled";
  createdAt: Date;
  updatedAt: Date;
}

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
