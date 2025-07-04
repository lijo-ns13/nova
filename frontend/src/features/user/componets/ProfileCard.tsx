import type React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../../hooks/useAppSelector";
import {
  Edit,
  MapPin,
  Briefcase,
  UserPlus,
  Eye,
  Bookmark,
  FileText,
  Activity,
} from "lucide-react";
import { SecureCloudinaryImage } from "../../../components/SecureCloudinaryImage";

const ProfileCard: React.FC = () => {
  const { name, profilePicture, headline, username } = useAppSelector(
    (state) => ({
      ...state.auth,
    })
  );

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg max-w-md w-full mx-auto">
      {/* Header with Edit Button */}
      <div className="h-16 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
        <Link
          to={`/in/${username}`}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors backdrop-blur-sm"
        >
          <Edit size={16} />
        </Link>
      </div>

      {/* Profile Photo - Centered above name */}
      <div className="flex justify-center mt-10">
        {profilePicture ? (
          <SecureCloudinaryImage
            publicId={profilePicture}
            alt={"profilecardimage"}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white dark:border-gray-800"
          />
        ) : (
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-gray-800">
            {getInitials(name || "")}
          </div>
        )}
      </div>

      {/* Profile Information */}
      <div className="px-4 md:px-6 pt-4 pb-6 text-center">
        <Link to={`/in/${username}`} className="group">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {name || "User Name"}
          </h2>
        </Link>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
          {headline || "Professional Headline"}
        </p>

        {/* Location and Company */}
        <div className="flex flex-col space-y-1 mt-3 text-sm text-gray-600 dark:text-gray-400 items-center"></div>

        {/* Stats */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
          <Link
            to="/network"
            className="flex flex-col items-center space-y-1 group"
          >
            <div className="flex items-center"></div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Grow your network
            </p>
          </Link>
          <Link
            to="/profile-views"
            className="flex flex-col items-center space-y-1 group"
          ></Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-gray-50 dark:bg-gray-700/50 px-4 md:px-6 py-3 grid grid-cols-3 gap-2">
        <Link
          to="/applied-jobs"
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FileText
            size={18}
            className="text-gray-600 dark:text-gray-300 mb-1"
          />
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
            Applied Jobs
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
