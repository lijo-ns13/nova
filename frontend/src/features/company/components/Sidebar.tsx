import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";
import socket from "../../../socket/socket";
import toast from "react-hot-toast";
import { setUnreadCount } from "../../../store/slice/notificationSlice";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { Menu, X } from "lucide-react";
import { getUnreadNotificationCount } from "../services/notificationService";
const Sidebar = () => {
  const dispatch = useAppDispatch();
  const { unreadCount } = useAppSelector((state) => state.notification);
  const [isOpen, setIsOpen] = useState(false); // For mobile toggle

  const location = useLocation();

  const fetchUnreadCountFn = async () => {
    const res = await getUnreadNotificationCount();

    dispatch(setUnreadCount(res));
    return res;
  };

  useEffect(() => {
    fetchUnreadCountFn();

    socket.on("unreadCountUpdate", (data: { count: number }) => {
      dispatch(setUnreadCount(data.count));
    });

    socket.on("newNotification", (notification) => {
      const { type, content } = notification;
      const icons: Record<string, string> = {
        FOLLOW: "👤",
        JOB: "💼",
        POST: "📝",
        COMMENT: "💬",
        LIKE: "❤️",
        MESSAGE: "📩",
        GENERAL: "🔔",
      };
      const message = `${icons[type] || "🔔"} ${content}`;
      toast(message);
    });

    return () => {
      socket.off("unreadCountUpdate");
      socket.off("newNotification");
    };
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/company/dashboard", icon: "📊" },
    { name: "Interviews", path: "/company/upcoming", icon: "📋" },
    { name: "Manage jobs", path: "/company/manage-jobs", icon: "🏢" },
    { name: "Notification", path: "/company/notifications", icon: "🔔" },
    { name: "Company Profile", path: "/company/company-profile", icon: "📋" },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center justify-between bg-gray-800 text-white p-4">
        <h2 className="text-lg font-semibold">NOVA</h2>
        <button onClick={toggleSidebar}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-200 ease-in-out z-40`}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-6 hidden md:block">NOVA</h2>
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
                    onClick={() => setIsOpen(false)} // close sidebar on mobile click
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

      {/* Backdrop on small screens when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
