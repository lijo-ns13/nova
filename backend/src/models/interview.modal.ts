import mongoose, { Document, Schema } from "mongoose";

export interface IInterview extends Document {
  companyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  scheduledAt: Date;
  status: "pending" | "accepted" | "rejected";
  roomId: string;
}

const InterviewSchema = new Schema<IInterview>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    scheduledAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    roomId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Interview = mongoose.model<IInterview>(
  "Interview",
  InterviewSchema
);
