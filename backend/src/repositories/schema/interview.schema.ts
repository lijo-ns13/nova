import { Schema } from "mongoose";
import { IInterview } from "../entities/interview.entity";

export const InterviewSchema = new Schema<IInterview>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "reschedule_proposed"],
      default: "pending",
    },
    result: {
      type: String,
      enum: ["pending", "pass", "fail"],
      default: "pending",
    },
    roomId: { type: String, required: true },
    rescheduleProposedSlots: [{ type: Date }],
    rescheduleReason: { type: String },
    rescheduleSelectedSlot: { type: Date },
  },
  { timestamps: true }
);
