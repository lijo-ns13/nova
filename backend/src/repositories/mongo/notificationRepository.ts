// src/repositories/notificationRepository.ts
import { injectable } from "inversify";

import mongoose from "mongoose";
import {
  INotification,
  Notification,
  NotificationType,
} from "../../models/notification.modal";
import { INotificationRepository } from "../../interfaces/repositories/INotificationRepository";

@injectable()
export class NotificationRepository implements INotificationRepository {
  async createNotification(
    userId: string,
    content: string,
    type: NotificationType,
    relatedId?: string,
    senderId?: string,
    metadata?: any
  ): Promise<INotification> {
    const notification = await Notification.create({
      userId: new mongoose.Types.ObjectId(userId),
      senderId: senderId ? new mongoose.Types.ObjectId(senderId) : undefined,
      content,
      type,
      relatedId: relatedId ? new mongoose.Types.ObjectId(relatedId) : undefined,
      metadata,
    });

    return notification;
  }

  async getUserNotifications(
    userId: string,
    limit: number = 20,
    skip: number = 0
  ): Promise<{ notifications: INotification[]; total: number }> {
    const [notifications, total] = await Promise.all([
      Notification.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "senderId",
          select: "name avatar",
        }),
      Notification.countDocuments({ userId }),
    ]);

    return { notifications, total };
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    return result.modifiedCount;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await Notification.countDocuments({ userId, isRead: false });
  }

  async deleteNotification(
    notificationId: string,
    userId: string
  ): Promise<boolean> {
    const result = await Notification.deleteOne({
      _id: notificationId,
      userId,
    });
    return result.deletedCount > 0;
  }
}
