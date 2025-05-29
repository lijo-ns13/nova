// models/notification.model.ts
import mongoose, { Schema, Document } from "mongoose";

export enum NotificationType {
  JOB = "job",
  POST = "post",
  COMMENT = "comment",
  LIKE = "like",
  MESSAGE = "message",
  FRIEND_REQUEST = "friend_request",
  GENERAL = "GENERAL",
}

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  type: NotificationType;
  relatedId?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    relatedId: { type: Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
