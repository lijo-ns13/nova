import mongoose, { Schema, Document, Types } from "mongoose";
import { NotificationType } from "../constants/notification.type.constant";
import { INotification } from "../repositories/entities/notification.entity";

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User" }, // ✅ Add this line
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
