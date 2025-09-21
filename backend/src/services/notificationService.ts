import { inject, injectable } from "inversify";
import { Server } from "socket.io";
import { TYPES } from "../di/types";
import { INotificationService } from "../interfaces/services/INotificationService";
import { INotificationRepository } from "../interfaces/repositories/INotificationRepository";
import { getUserByIdAcrossCollections } from "../utils/getUserSocketData";
import { NotificationMapper } from "../mapping/notificationmapper";
import { NotificationResponseDTO } from "../core/dtos/response/notification.response.dto";
import { NotificationType } from "../constants/notification.type.constant";
@injectable()
export class NotificationService implements INotificationService {
  private io?: Server;
  constructor(
    @inject(TYPES.NotificationRepository)
    private readonly notificationRepository: INotificationRepository
  ) {}
  public setSocketIO(io: Server) {
    this.io = io;
  }
  private async sendRealTimeNotification(
    userId: string,
    notification: NotificationResponseDTO
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
    relatedId?: string
  ): Promise<NotificationResponseDTO> {
    const notification = await this.notificationRepository.createNotification(
      userId,
      content,
      type,
      senderId,
      relatedId
    );

    const dto = NotificationMapper.toDTO(notification);
    await this.sendRealTimeNotification(userId, dto);
    return dto;
  }

  async sendNotification(
    userId: string,
    content: string,
    type: NotificationType,
    senderId?: string
  ): Promise<NotificationResponseDTO> {
    return this.createNotification(userId, content, type, senderId);
  }

  async getUserNotifications(
    userId: string,
    limit = 20,
    skip = 0
  ): Promise<{ notifications: NotificationResponseDTO[]; total: number }> {
    const { notifications, total } =
      await this.notificationRepository.getUserNotifications(
        userId,
        limit,
        skip
      );

    return {
      notifications: NotificationMapper.toDTOs(notifications),
      total,
    };
  }
  async markAsRead(
    notificationId: string
  ): Promise<NotificationResponseDTO | null> {
    const notification = await this.notificationRepository.markAsRead(
      notificationId
    );
    return notification ? NotificationMapper.toDTO(notification) : null;
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

  async deleteAllNotifications(userId: string): Promise<number> {
    return this.notificationRepository.deleteAllNotifications(userId);
  }
}
