// src/interfaces/services/INotificationService.ts

import {
  INotification,
  NotificationType,
} from "../../models/notification.modal";

export interface INotificationService {
  createNotification(
    userId: string,
    content: string,
    type: NotificationType,
    relatedId?: string,
    senderId?: string,
    metadata?: any
  ): Promise<INotification>;
  sendNotification(
    userId: string,
    content: string,
    senderId?: string,
    metadata?: any
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
}
