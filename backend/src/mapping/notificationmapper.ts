import { NotificationResponseDTO } from "../core/dtos/response/notification.response.dto";
import { INotification } from "../repositories/entities/notification.entity";

export class NotificationMapper {
  static toDTO(notification: INotification): NotificationResponseDTO {
    return {
      id: notification._id.toString(),
      content: notification.content,
      type: notification.type,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
      senderId: notification.senderId?.toString(),
      relatedId: notification.relatedId?.toString(),
    };
  }

  static toDTOs(notifications: INotification[]): NotificationResponseDTO[] {
    return notifications.map(this.toDTO);
  }
}
