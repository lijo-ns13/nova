import mongoose, { Document, Schema, Types } from "mongoose";

export interface IInterview extends Document {
  _id: Types.ObjectId;
  companyId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  applicationId: mongoose.Types.ObjectId | string;
  scheduledAt: Date;
  status: "pending" | "accepted" | "rejected" | "reschedule_proposed";
  result: "pending" | "pass" | "fail";
  roomId: string;
  rescheduleProposedSlots?: Date[];
  rescheduleReason?: string;
  rescheduleSelectedSlot?: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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

export const Interview = mongoose.model<IInterview>(
  "Interview",
  InterviewSchema
);
