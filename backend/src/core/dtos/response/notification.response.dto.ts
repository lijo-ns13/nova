// src/dtos/notification/notificationResponse.dto.ts
export interface NotificationResponseDTO {
  id: string;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  senderId?: string;
  relatedId?: string;
}
