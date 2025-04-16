import type React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";

interface ProfileCardProps {
  connections?: number;
  email?: string;
  location?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  connections = 0,
  email = "",
  location = "",
}) => {
  const navigate = useNavigate();
  const { name, headline, profilePicture } = useAppSelector(
    (state) => state.auth
  );
  const [isHovering, setIsHovering] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleProfileClick = () => {
    navigate("/user-profile");
  };

  const isCompact = windowWidth < 640;

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl dark:from-gray-800 dark:to-gray-900 dark:text-white">
      {/* Banner & Profile Picture */}
      <div
        className="relative h-32 bg-gradient-to-r from-emerald-400 to-teal-500"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            {profilePicture ? (
              <img
                src={profilePicture || "/placeholder.svg"}
                alt={name}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-3xl font-bold">
                {getInitials(name || "")}
              </div>
            )}
            {isHovering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 pb-6 px-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{headline}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center justify-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {email}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center justify-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {location}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {["React", "TypeScript", "Tailwind CSS"].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-sm rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleProfileClick}
            className="inline-flex justify-center items-center px-4 py-2 rounded-md bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium transition-colors duration-200"
          >
            View Profile
          </button>
          <button className="inline-flex justify-center items-center px-4 py-2 rounded-md border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 font-medium transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Connect
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/saved-jobs"
            className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span className={`${isCompact ? "text-sm" : ""}`}>Saved Jobs</span>
          </Link>
          <Link
            to="/applied-jobs"
            className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className={`${isCompact ? "text-sm" : ""}`}>
              Applied Jobs
            </span>
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {connections}+ Connections
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
