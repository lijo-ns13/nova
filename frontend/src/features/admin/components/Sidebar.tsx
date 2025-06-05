import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";
import socket from "../../../socket/socket";
import toast from "react-hot-toast";
import { setUnreadCount } from "../../../store/slice/notificationSlice";
import { useEffect } from "react";
import adminAxios from "../../../utils/adminAxios";
import { useAppDispatch } from "../../../hooks/useAppDispatch";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { unreadCount } = useAppSelector((state) => state.notification);

  const fetchUnreadCountFn = async () => {
    const res = await adminAxios.get(
      "http://localhost:3000/notification/unread-count",
      {
        withCredentials: true,
      }
    );
    dispatch(setUnreadCount(res.data.count));
    console.log("ressy", res);
    return res;
  };
  useEffect(() => {
    // Initial fetch
    fetchUnreadCountFn();

    // Listen to real-time updates
    socket.on("unreadCountUpdate", (data: { count: number }) => {
      dispatch(setUnreadCount(data.count));
    });

    socket.on("newNotification", (notification) => {
      const { type, content } = notification;

      let message = "";

      switch (type) {
        case "FOLLOW":
          message = `👤 ${content}`; // e.g., "siyad followed you"
          break;
        case "JOB":
          message = `💼 ${content}`; // e.g., "New job posted"
          break;
        case "POST":
          message = `📝 ${content}`; // e.g., "New post from XYZ"
          break;
        case "COMMENT":
          message = `💬 ${content}`; // e.g., "XYZ commented on your post"
          break;
        case "LIKE":
          message = `❤️ ${content}`; // e.g., "XYZ liked your post"
          break;
        case "MESSAGE":
          message = `📩 ${content}`; // e.g., "New message from XYZ"
          break;
        case "GENERAL":
          message = `🔔 ${content}`; // General purpose
          break;
        default:
          message = `🔔 ${content}`;
      }

      toast(message);
      console.log("New notification received:", notification);
    });

    return () => {
      // Clean up listeners on unmount
      socket.off("unreadCountUpdate");
      socket.off("newNotification");
    };
  }, []);
  const location = useLocation();

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
      name: "Subscription Management",
      path: "/admin/subscription-management",
      icon: "🔔",
    },
    { name: "Notification", path: "/admin/notification", icon: "🏢" },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-6">Company Portal</h2>

        <ul>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isNotification = item.name === "Notification";
            return (
              <li key={item.path} className="mb-2">
                <Link
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {isNotification && unreadCount > 0 && (
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
  );
};

export default Sidebar;
