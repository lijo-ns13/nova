// context/NotificationContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { Notification, NotificationsResponse } from "../types/notification";
import {
  fetchNotifications,
  fetchUnreadCount,
} from "../services/notificationApi";
import { socket } from "../lib/socket";
import { useAuth } from "./AuthContext";

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    await loadNotifications();
  };

  useEffect(() => {
    if (user) {
      loadNotifications();

      // Set up socket listeners
      socket.on("receiveNotification", (notification: Notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      socket.on("unreadCountUpdate", ({ count }: { count: number }) => {
        setUnreadCount(count);
      });

      return () => {
        socket.off("receiveNotification");
        socket.off("unreadCountUpdate");
      };
    }
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { notification, unreadCount } = await markNotificationAsRead(
        notificationId
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? notification : n))
      );
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { unreadCount } = await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
