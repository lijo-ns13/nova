import React, { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import userAxios from "../../../utils/userAxios";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setUnreadCount } from "../../../store/slice/notificationSlice";
import socket from "../../../socket/socket";
import { Bell, Check, Loader2, RefreshCw } from "lucide-react";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { NotificationSkeleton } from "../componets/NotificationSkeleton";
import { Notification as Noty } from "../../../types/notification";
// import { SecureCloudinaryImage } from "../../../components/SecureCloudinaryImage";
dayjs.extend(relativeTime);

const PAGE_SIZE = 15;

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Noty[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();

  // Fetch notifications with pagination
  const fetchNotifications = useCallback(
    async (pageNum: number = 1, refresh: boolean = false) => {
      try {
        if (refresh) setRefreshing(true);
        else if (pageNum === 1) setLoading(true);

        const res = await userAxios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/notification?page=${pageNum}&limit=${PAGE_SIZE}`
        );

        if (refresh) {
          setNotifications(res.data.data.notifications);
        } else {
          setNotifications((prev) =>
            pageNum === 1
              ? res.data.data.notifications
              : [...prev, ...res.data.data.notifications]
          );
        }

        setHasMore(res.data.data.notifications.length === PAGE_SIZE);
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        if (refresh) setRefreshing(false);
        else if (pageNum === 1) setLoading(false);
      }
    },
    []
  );
  const deleteAllFn = async () => {
    try {
      await userAxios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/notification/delete-all`
      );
      dispatch(setUnreadCount(0));
      setNotifications([]); // clear UI
    } catch (err) {
      console.error("Failed to delete all notifications", err);
    }
  };

  // Mark all as read
  const readAllFn = async () => {
    try {
      await userAxios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/notification/read-all`
      );
      dispatch(setUnreadCount(0));
      // Update local state to mark all as read
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  // Handle new notifications from socket
  useEffect(() => {
    const handleNewNotification = (notification: Noty) => {
      setNotifications((prev) => [notification, ...prev]);
      // Play a subtle sound for new notification
      if (Notification.permission === "granted") {
        new Audio("/notification-sound.mp3")
          .play()
          .catch((e) => console.log("Sound play failed", e));
      }
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, []);

  // Initial load and mark all as read
  useEffect(() => {
    fetchNotifications();
    readAllFn();
  }, [fetchNotifications]);

  // Infinite scroll handler
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  }, [loading, hasMore, page, fetchNotifications]);

  // Infinite scroll setup
  const { observerTarget } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: loadMore,
  });

  // Refresh notifications
  const handleRefresh = () => {
    setPage(1);
    fetchNotifications(1, true);
  };

  // Mark single notification as read
  const markAsRead = async (id: string) => {
    try {
      await userAxios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/notification/read/${id}`
      );
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  // Notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "FOLLOW":
        return <span className="text-blue-500">👤</span>;
      case "JOB":
        return <span className="text-green-500">💼</span>;
      case "POST":
        return <span className="text-purple-500">📝</span>;
      case "COMMENT":
        return <span className="text-yellow-500">💬</span>;
      case "LIKE":
        return <span className="text-red-500">❤️</span>;
      case "MESSAGE":
        return <span className="text-indigo-500">📩</span>;
      default:
        return <span className="text-gray-500">🔔</span>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20 sm:pb-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Bell className="mr-2" size={20} />
          Notifications
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Refresh notifications"
          >
            <RefreshCw
              size={18}
              className={`text-gray-500 dark:text-gray-400 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
          </button>
          {/* <button
            onClick={readAllFn}
            className="flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <Check size={16} className="mr-1" />
            Mark all as read
          </button> */}
          <button
            onClick={deleteAllFn}
            className="flex items-center px-3 py-1 text-sm bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-700 dark:text-white rounded-lg transition-colors"
          >
            <Check size={16} className="mr-1" />
            Mark all as read
          </button>
        </div>
      </div>

      {loading && !refreshing ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell size={48} className="text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            No notifications yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            When you get notifications, they'll appear here
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-2">
            {notifications.map((notif) => (
              <li
                key={notif._id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  notif.isRead
                    ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    : "bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600"
                } border border-gray-100 dark:border-gray-700`}
                onClick={() => markAsRead(notif._id)}
              >
                <div className="flex-shrink-0 mt-1">
                  {notif.senderId?.profilePicture ? (
                    <img
                      src={notif.senderId.profilePicture || "/default.png"}
                      alt={notif.senderId.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800"
                    />
                  ) : (
                    // <SecureCloudinaryImage
                    //   publicId={notif.senderId.profilePicture}
                    //   alt={notif.senderId.name}
                    //   className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-800"
                    // />
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 font-medium">
                      {notif.senderId?.name
                        ? notif.senderId.name.charAt(0).toUpperCase()
                        : "S"}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getNotificationIcon(notif.type)}
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {notif.senderId?.name ?? "System"}
                    </p>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                    {notif.content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {dayjs(notif.createdAt).fromNow()}
                  </p>
                </div>

                {!notif.isRead && (
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-3" />
                )}
              </li>
            ))}
          </ul>

          {hasMore && (
            <div ref={observerTarget} className="flex justify-center py-4">
              <Loader2 className="animate-spin text-gray-500" size={24} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NotificationPage;
