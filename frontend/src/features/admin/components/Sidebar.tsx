import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { setUnreadCount } from "../../../store/slice/notificationSlice";
import adminAxios from "../../../utils/adminAxios";
import socket from "../../../socket/socket";
import toast from "react-hot-toast";
import { FiMenu, FiX } from "react-icons/fi";
import path from "path";
interface NotificationPayload {
  _id: string;
  userId: string;
  senderId: string;
  content: string;
  type: "FOLLOW" | "JOB" | "POST" | "COMMENT" | "LIKE" | "MESSAGE" | "GENERAL";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { unreadCount } = useAppSelector((state) => state.notification);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const BASE_URL = `${API_BASE_URL}`;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch unread count once on mount
  const fetchUnreadCount = async () => {
    try {
      const res = await adminAxios.get(
        `${BASE_URL}/notification/unread-count`,
        {
          withCredentials: true,
        }
      );
      dispatch(setUnreadCount(res.data.count));
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();

    // Listen to socket events
    const handleUnreadCountUpdate = (data: { count: number }) => {
      dispatch(setUnreadCount(data.count));
    };

    const handleNewNotification = (notification: NotificationPayload) => {
      console.log("notificationnnn=><=", notification);
      const { type, content } = notification;

      const typeIconMap: Record<string, string> = {
        FOLLOW: "👤",
        JOB: "💼",
        POST: "📝",
        COMMENT: "💬",
        LIKE: "❤️",
        MESSAGE: "📩",
        GENERAL: "🔔",
      };

      const icon = typeIconMap[type] || "🔔";
      toast(`${icon} ${content}`);
      console.log("New notification received:", notification);
    };

    socket.on("unreadCountUpdate", handleUnreadCountUpdate);
    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("unreadCountUpdate", handleUnreadCountUpdate);
      socket.off("newNotification", handleNewNotification);
    };
  }, [dispatch]);

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "User Management", path: "/admin/user-management", icon: "📝" },
    {
      name: "Company Management",
      path: "/admin/company-management",
      icon: "📋",
    },
    {
      name: "Company Verification",
      path: "/admin/company-verification",
      icon: "👥",
    },
    { name: "Skill Management", path: "/admin/skill-management", icon: "📋" },
    {
      name: "Subcription History",
      path: "/admin/subscription-history",
      icon: "📜",
    },
    {
      name: "Subscription Management",
      path: "/admin/subscription-management",
      icon: "🔔",
    },
    { name: "Notification", path: "/admin/notification", icon: "🏢" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed lg:hidden z-50 top-4 left-4 p-2 rounded-md bg-gray-800 text-white"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static z-50 w-64 bg-gray-800 text-white min-h-screen transition-all duration-300 ease-in-out ${
          isOpen ? "left-0" : "-left-64"
        }`}
      >
        <div className="p-4 h-full">
          <ul>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const isNotificationTab = item.name === "Notification";

              return (
                <li key={item.path} className="mb-2">
                  <Link
                    to={item.path}
                    onClick={() => isMobile && setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    {isNotificationTab && unreadCount > 0 && (
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
