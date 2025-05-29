// types/notification.ts
export type NotificationType =
  | "job"
  | "post"
  | "comment"
  | "like"
  | "message"
  | "friend_request";

export interface Notification {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  type: NotificationType;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}
