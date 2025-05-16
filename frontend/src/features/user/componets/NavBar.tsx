import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { logout } from "../../auth/auth.slice";
import { logOut } from "../services/AuthServices";
import {
  Home,
  Briefcase,
  Users,
  Bell,
  MessageSquare,
  Search,
  Menu,
  X,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import toast from "react-hot-toast";
import socket from "../../../socket/socket";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showMessages, setShowMessages] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { name, profilePicture, username } = useAppSelector(
    (state) => state.auth
  );
  const navRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Handle dark mode
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Handle click outside to close menus
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
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        messagesRef.current &&
        !messagesRef.current.contains(event.target as Node)
      ) {
        setShowMessages(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logOut();
      socket.disconnect();
      dispatch(logout());

      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Check if a route is active
  const isActive = (path: string) => location.pathname === path;

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
    { path: "/networking", label: "My Network", icon: <Users size={20} /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white dark:bg-gray-800 shadow-md"
          : "bg-white dark:bg-gray-800"
      } h-16`} // Fixed height to prevent layout shifts
      ref={navRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Left section: Logo + Search */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-black dark:bg-white flex items-center justify-center mr-2">
                <span className="text-white dark:text-black font-bold text-sm">
                  JP
                </span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">
                JobPortal
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block ml-4 relative w-56 lg:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm"
                placeholder="Search jobs, people..."
              />
            </div>
          </div>

          {/* Center section: Main Navigation (desktop) */}
          <nav className="hidden md:flex items-center justify-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center px-3 py-1 rounded-md transition-colors duration-200 relative ${
                  isActive(link.path)
                    ? "text-black dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
                }`}
              >
                <div
                  className={`p-1 ${
                    isActive(link.path)
                      ? "text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {link.icon}
                </div>
                <span className="text-xs font-medium mt-1">{link.label}</span>
                {isActive(link.path) && (
                  <div className="absolute -bottom-[16px] w-full h-0.5 bg-black dark:bg-white"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Right section: Action buttons */}
          <div className="flex items-center space-x-1">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMessages(false);
                  setShowUserMenu(false);
                }}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none relative"
                aria-label="Notifications"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              <span className="font-medium">John Doe</span>{" "}
                              viewed your profile
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              2 hours ago
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to="/notifications"
                      className="text-sm text-black dark:text-white font-medium hover:underline"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="relative" ref={messagesRef}>
              <button
                onClick={() => {
                  setShowMessages(!showMessages);
                  setShowNotifications(false);
                  setShowUserMenu(false);
                }}
                className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none relative"
                aria-label="Messages"
              >
                <MessageSquare size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {showMessages && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Messages
                    </h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              Jane Smith
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              Hey, I saw your profile and wanted to connect...
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              5m
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to="/messages"
                      className="text-sm text-black dark:text-white font-medium hover:underline"
                    >
                      View all messages
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <Link
                to="/user-profile"
                className="flex items-center focus:outline-none"
                onClick={(e) => {
                  if (e.ctrlKey || e.metaKey) return; // Allow opening in new tab
                  e.preventDefault();
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                  setShowMessages(false);
                }}
              >
                <div className="flex items-center">
                  {profilePicture ? (
                    <img
                      src={profilePicture || "/placeholder.svg"}
                      alt={name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">
                      {getInitials(name || "")}
                    </div>
                  )}
                </div>
              </Link>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {name || "User Name"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Software Developer
                    </p>
                  </div>
                  <Link
                    to={`/in/${username}`}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/help"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Help Center
                  </Link>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center">
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-1 p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none md:hidden"
              aria-label="Toggle menu"
            >
              {!isOpen ? <Menu size={20} /> : <X size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search - only visible on mobile */}
      <div className={`md:hidden px-4 py-2 ${isOpen ? "block" : "hidden"}`}>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent text-sm"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-64 opacity-100 shadow-lg"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span className="mr-3">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
