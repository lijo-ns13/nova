import { useState, useEffect } from "react";

import { NotificationType } from "../types/notification";
import { socket } from "../lib/socket";
import { useAuth } from "../hooks/useAuth";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotifications,
} from "../api/notifications";
import { NotificationItem } from "../componets/notification/NotificationItem";

export const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getNotifications(user.id);
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Set up socket listeners
    socket.on("receiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on("unreadCountUpdate", ({ count }) => {
      setUnreadCount(count);
    });

    return () => {
      socket.off("receiveNotification");
      socket.off("unreadCountUpdate");
    };
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading notifications...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          You don't have any notifications yet.
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <NotificationItem
              id={""}
              content={""}
              type={undefined}
              isRead={false}
              createdAt={undefined}
              key={notification.id}
              {...notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};
