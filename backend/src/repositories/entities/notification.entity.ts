import { Types } from "mongoose";
import { NotificationType } from "../../constants/notification.type.constant";

export interface INotification {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  type: NotificationType;
  relatedId?: Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}
