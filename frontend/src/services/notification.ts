// services/notificationApi.ts
import axios from "axios";
import { Notification, NotificationsResponse } from "../types/notification";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchNotifications = async (): Promise<NotificationsResponse> => {
  const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
    withCredentials: true,
  });
  return response.data;
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<{ notification: Notification; unreadCount: number }> => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/notifications/${notificationId}/read`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<{
  success: boolean;
  unreadCount: number;
}> => {
  const response = await axios.patch(
    `${API_BASE_URL}/api/notifications/mark-all-read`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const fetchUnreadCount = async (): Promise<{ count: number }> => {
  const response = await axios.get(
    `${API_BASE_URL}/api/notifications/unread-count`,
    { withCredentials: true }
  );
  return response.data;
};
