import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { logout } from "../../auth/auth.slice";
import { logOut } from "../services/AuthServices";
import novalog from "../../../assets/novalogo.png";
import {
  Home,
  Briefcase,
  Users,
  Search,
  Menu,
  X,
  LogOut,
  Bell,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import socket from "../../../socket/socket";
import userAxios from "../../../utils/userAxios";
import { setUnreadCount } from "../../../store/slice/notificationSlice";
import { SecureCloudinaryImage } from "../../../components/SecureCloudinaryImage";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { unreadCount } = useAppSelector((state) => state.notification);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { name, profilePicture, username, isSubscriptionActive } =
    useAppSelector((state) => state.auth);
  const navRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const fetchUnreadCountFn = async () => {
    try {
      const res = await userAxios.get("/notification/unread-count", {
        withCredentials: true,
      });
      dispatch(setUnreadCount(res.data.count));
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCountFn();

    socket.on("unreadCountUpdate", (data: { count: number }) => {
      dispatch(setUnreadCount(data.count));
    });

    socket.on("newNotification", (notification) => {
      const { type, content } = notification;
      let message = "";

      switch (type) {
        case "FOLLOW":
          message = `👤 ${content}`;
          break;
        case "JOB":
          message = `💼 ${content}`;
          break;
        case "POST":
          message = `📝 ${content}`;
          break;
        case "COMMENT":
          message = `💬 ${content}`;
          break;
        case "LIKE":
          message = `❤️ ${content}`;
          break;
        case "MESSAGE":
          message = `📩 ${content}`;
          break;
        case "GENERAL":
          message = `🔔 ${content}`;
          break;
        default:
          message = `🔔 ${content}`;
      }

      toast(message);
    });

    return () => {
      socket.off("unreadCountUpdate");
      socket.off("newNotification");
    };
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      sessionStorage.removeItem("subscriptionModalShown");
      await logOut();
      socket.disconnect();
      dispatch(logout());
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const navLinks = [
    { path: "/feed", label: "Home", icon: <Home size={20} /> },
    { path: "/jobs", label: "Jobs", icon: <Briefcase size={20} /> },
    { path: "/message", label: "Messages", icon: <MessageSquare size={20} /> },
    { path: "/notification", label: "Notifications", icon: <Bell size={20} /> },
    { path: "/network", label: "Network", icon: <Users size={20} /> },
  ];

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white dark:bg-gray-900 shadow-sm"
          : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mr-2 p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link to="/home" className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-black dark:bg-white flex items-center justify-center mr-2">
                <img
                  src={novalog}
                  alt="Nova Logo"
                  className="h-8 sm:h-9 w-auto"
                />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">
                NOVA
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-800"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <div className="relative">
                  {link.icon}
                  {link.path === "/notification" && unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                <span className="ml-2 text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Search and User Profile */}
          <div className="flex items-center space-x-3">
            {/* User Profile */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center focus:outline-none"
                aria-label="User menu"
              >
                <div className="flex items-center">
                  {profilePicture ? (
                    // <img
                    //   src={profilePicture}
                    //   alt={name || "User"}
                    //   className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    // />
                    <SecureCloudinaryImage
                      publicId={profilePicture}
                      alt={"user"}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                      {getInitials(name || "")}
                    </div>
                  )}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {name || "User Name"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      @{username || "username"}
                    </p>
                  </div>
                  <Link
                    to={`/in/${username}`}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/subscription"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Subscription
                  </Link>
                  {isSubscriptionActive && (
                    <Link
                      to="/refund"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Refund
                    </Link>
                  )}
                  <Link
                    to="/help"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Help Center
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-2 pt-2 pb-4 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          {/* Mobile Navigation Links */}
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-3 py-3 rounded-lg mx-1 ${
                location.pathname === link.path
                  ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <div className="relative">
                {link.icon}
                {link.path === "/notification" && unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span className="ml-3 text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
