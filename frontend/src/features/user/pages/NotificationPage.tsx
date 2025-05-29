import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import userAxios from "../../../utils/userAxios";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setUnreadCount } from "../../../store/slice/notificationSlice";
dayjs.extend(relativeTime);

interface Sender {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
}

interface Notification {
  _id: string;
  userId: string;
  senderId?: Sender | null;
  content: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const readAllFn = async () => {
    const res = await userAxios.patch(
      "http://localhost:3000/notification/read-all"
    );
    return res;
  };
  useEffect(() => {
    fetchNotifications();
    readAllFn();
    dispatch(setUnreadCount(0));
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await userAxios.get("http://localhost:3000/notification");
      setNotifications(res.data.data.notifications);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`flex items-start gap-3 p-4 rounded-xl shadow-sm border ${
                notif.isRead ? "bg-white" : "bg-blue-50"
              }`}
            >
              {notif.senderId?.profilePicture ? (
                <img
                  src={notif.senderId.profilePicture}
                  alt={notif.senderId.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                  ?
                </div>
              )}

              <div>
                <p className="text-sm text-gray-800">
                  <span className="font-medium">
                    {notif.senderId?.name ?? "System"}
                  </span>{" "}
                  {notif.content}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {dayjs(notif.createdAt).fromNow()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
