import mongoose from "mongoose";
import { INotification } from "../entities/notification.entity";
import { notificationSchema } from "../schema/notification.schema";

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
