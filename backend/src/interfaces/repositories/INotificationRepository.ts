// src/interfaces/repositories/INotificationRepository.ts

import {
  INotification,
  NotificationType,
} from "../../models/notification.modal";

export interface INotificationRepository {
  createNotification(
    userId: string,
    content: string,
    type: NotificationType,
    relatedId?: string,
    senderId?: string
  ): Promise<INotification>;
  getUserNotifications(
    userId: string,
    limit?: number,
    skip?: number
  ): Promise<{ notifications: INotification[]; total: number }>;
  markAsRead(notificationId: string): Promise<INotification | null>;
  markAllAsRead(userId: string): Promise<number>;
  getUnreadCount(userId: string): Promise<number>;
  deleteNotification(notificationId: string, userId: string): Promise<boolean>;
  deleteAllNotifications(userId: string): Promise<number>;
}
