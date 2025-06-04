// src/services/notificationService.ts
import { inject, injectable } from "inversify";
import { Server } from "socket.io";
import { TYPES } from "../di/types";
import { INotificationService } from "../interfaces/services/INotificationService";
import { INotificationRepository } from "../interfaces/repositories/INotificationRepository";
import { INotification, NotificationType } from "../models/notification.modal";
import userModal from "../models/user.modal";
import { getUserByIdAcrossCollections } from "../utils/getUserSocketData";
@injectable()
export class NotificationService implements INotificationService {
  private io?: Server;
  constructor(
    @inject(TYPES.NotificationRepository)
    private notificationRepository: INotificationRepository
  ) {}
  public setSocketIO(io: Server) {
    this.io = io;
  }
  private async sendRealTimeNotification(
    userId: string,
    notification: INotification
  ) {
    if (!this.io) {
      console.log(
        "⚠️ Socket.IO not yet initialized, skipping notification emit"
      );
      return;
    }
    const user = await getUserByIdAcrossCollections(userId);
    console.log("slfjslkfjslfjslf,", user?.socketId, this.io);
    if (user?.socketId && this.io) {
      console.log("live....................😊");
      this.io.to(user.socketId).emit("newNotification", notification);
      this.io.to(user.socketId).emit("unreadCountUpdate", {
        count: await this.notificationRepository.getUnreadCount(userId),
      });
    }
  }

  async createNotification(
    userId: string,
    content: string,
    type: NotificationType,
    senderId?: string,
    relatedId?: string,
    metadata?: any
  ): Promise<INotification> {
    const notification = await this.notificationRepository.createNotification(
      userId,
      content,
      type,
      senderId,
      relatedId,
      metadata
    );

    await this.sendRealTimeNotification(userId, notification);
    return notification;
  }

  async sendNotification(
    userId: string,
    content: string,
    type: NotificationType,
    senderId?: string,
    metadata?: any
  ): Promise<INotification> {
    return this.createNotification(
      userId,
      content,
      type,
      senderId,
      undefined,
      metadata
    );
  }

  async getUserNotifications(
    userId: string,
    limit?: number,
    skip?: number
  ): Promise<{ notifications: INotification[]; total: number }> {
    return this.notificationRepository.getUserNotifications(
      userId,
      limit,
      skip
    );
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return this.notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<number> {
    return this.notificationRepository.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.getUnreadCount(userId);
  }

  async deleteNotification(
    notificationId: string,
    userId: string
  ): Promise<boolean> {
    return this.notificationRepository.deleteNotification(
      notificationId,
      userId
    );
  }
}
