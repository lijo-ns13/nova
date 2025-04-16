// src/shared/models/job.model.ts
import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "./user.modal";

export enum EmploymentType {
  FULL_TIME = "full-time",
  PART_TIME = "part-time",
  CONTRACT = "contract",
  TEMPORARY = "temporary",
  INTERNSHIP = "internship",
  FREELANCE = "freelance",
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

export enum ApplicationStatus {
  APPLIED = "applied",
  SHORTLISTED = "shortlisted",
  REJECTED = "rejected",
  SELECTED = "selected",
  WITHDRAWN = "withdrawn",
}

export interface SalaryRange {
  currency: string;
  min: number;
  max: number;
  isVisibleToApplicants: boolean;
}

export interface JobApplication {
  user: mongoose.Types.ObjectId | IUser;
  appliedAt: Date;
  resumeUrl: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  notes?: string;
  statusHistory?: {
    status: ApplicationStatus;
    changedAt: Date;
  }[];
}

export interface InterviewDetails {
  scheduledAt: Date;
  interviewers: mongoose.Types.ObjectId[]; // Ref: User
  meetLink?: string;
  feedback?: string;
  webrtcSession?: {
    sessionId?: string;
    startedAt?: Date;
    endedAt?: Date;
    recordingUrl?: string;
  };
}

export interface IJob extends Document {
  title: string;
  description: string;
  location: string;
  jobType: JobType;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;

  company: Types.ObjectId;

  skillsRequired: Types.ObjectId[];
  salary: SalaryRange;
  benefits: string[];
  perks?: string[];
  applicationDeadline: Date;

  applications: JobApplication[];
  selectedCandidates: mongoose.Types.ObjectId[] | IUser[];
  rejectedCandidates: {
    user: mongoose.Types.ObjectId | IUser;
    reason: string;
  }[];

  interviewDetails?: InterviewDetails;

  status: "open" | "closed" | "filled";
  createdBy: { type: Schema.Types.ObjectId; ref: "Company"; required: true };

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
    },
    description: {
      type: String,
      required: true,
      minlength: 50,
    },
    location: {
      type: String,
      required: true,
      trim: true,
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
          message:
            "Maximum salary must be greater than or equal to minimum salary",
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
      validate: [
        (val: string[]) => val.length > 0,
        "At least one benefit is required",
      ],
    },
    perks: {
      type: [String],
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    applications: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        resumeUrl: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: Object.values(ApplicationStatus),
          default: ApplicationStatus.APPLIED,
        },
        rejectionReason: String,
        notes: String,
        statusHistory: [
          {
            status: {
              type: String,
              enum: Object.values(ApplicationStatus),
            },
            changedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    selectedCandidates: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rejectedCandidates: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        reason: {
          type: String,
          required: true,
        },
      },
    ],
    interviewDetails: {
      scheduledAt: Date,
      interviewers: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      meetLink: String,
      feedback: String,
      webrtcSession: {
        sessionId: String,
        startedAt: Date,
        endedAt: Date,
        recordingUrl: String,
      },
    },
    status: {
      type: String,
      enum: ["open", "closed", "filled"],
      default: "open",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexing
JobSchema.index({ title: "text", description: "text" });
JobSchema.index({ company: 1, status: 1 });
JobSchema.index({ "salary.min": 1, "salary.max": 1 });
JobSchema.index({ applicationDeadline: 1 });

// Pre-save validation
JobSchema.pre<IJob>("save", function (next) {
  if (this.salary.min > this.salary.max) {
    return next(
      new Error("Minimum salary cannot be greater than maximum salary")
    );
  }

  const userSet = new Set(this.applications.map((a) => a.user.toString()));
  if (userSet.size !== this.applications.length) {
    return next(
      new Error("Duplicate applications from the same user are not allowed")
    );
  }

  next();
});

export default mongoose.model<IJob>("Job", JobSchema);
