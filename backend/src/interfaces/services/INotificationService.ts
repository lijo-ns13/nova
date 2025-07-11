import { NotificationResponseDTO } from "../../core/dtos/response/notification.response.dto";
import { NotificationType } from "../../models/notification.modal";

export interface INotificationService {
  createNotification(
    userId: string,
    content: string,
    type: NotificationType,
    senderId?: string,
    relatedId?: string
  ): Promise<NotificationResponseDTO>;

  sendNotification(
    userId: string,
    content: string,
    type: NotificationType,
    senderId?: string
  ): Promise<NotificationResponseDTO>;

  getUserNotifications(
    userId: string,
    limit?: number,
    skip?: number
  ): Promise<{
    notifications: NotificationResponseDTO[];
    total: number;
  }>;

  markAsRead(notificationId: string): Promise<NotificationResponseDTO | null>;

  markAllAsRead(userId: string): Promise<number>;

  getUnreadCount(userId: string): Promise<number>;

  deleteNotification(
    notificationId: string,
    userId: string
  ): Promise<boolean>;

  deleteAllNotifications(userId: string): Promise<number>;

  setSocketIO(io: import("socket.io").Server): void;
}

