import React, { useState } from "react";
import { User as UserIcon, UserPlus, UserMinus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export interface User {
  id: string;
  name: string;
  username: string;
  profilePicture?: string | null;
  headline?: string;
}

export interface NetworkUser {
  user: User;
  isFollowing: boolean;
  isCurrentUser?: boolean;
}

interface NetworkCardProps {
  networkUser: NetworkUser;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
}

const NetworkCard: React.FC<NetworkCardProps> = ({
  networkUser,
  onFollow,
  onUnfollow,
}) => {
  const { user, isFollowing } = networkUser;
  const [loading, setLoading] = useState(false);
  const handleFollowClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      await onFollow(user.id);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollowClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      await onUnfollow(user.id);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-full flex">
      <Link
        to={`/in/${user.username}`}
        className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col w-full"
        aria-label={`View ${user.name}'s profile`}
      >
        {/* Card Header with banner */}
        <div className="h-12 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        {/* Card Content */}
        <div className="p-6 flex flex-col flex-1">
          {/* Profile Info Section */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="relative -mt-10 flex-shrink-0">
              {user.profilePicture ? (
                <img
                  className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-md"
                  src={user.profilePicture}
                  alt={user.name}
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center border-4 border-white shadow-md">
                  <UserIcon className="h-8 w-8 text-gray-500" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {user.name}
              </h2>
              <p className="text-sm text-gray-600 truncate">@{user.username}</p>
            </div>
          </div>

          {/* Headline with constrained height */}
          <div className="flex-1 mb-4 min-h-[40px] max-h-[60px] overflow-y-auto">
            {user.headline && (
              <p className="text-sm text-gray-600">{user.headline}</p>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-auto h-10 flex justify-end items-center">
            {isFollowing ? (
              <button
                onClick={handleUnfollowClick}
                disabled={loading}
                className="flex items-center justify-center space-x-1 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 disabled:opacity-60 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 w-[110px]"
                aria-label={`Unfollow ${user.name}`}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <UserMinus size={16} />
                )}
                <span>{loading ? "..." : "Unfollow"}</span>
              </button>
            ) : (
              <button
                onClick={handleFollowClick}
                disabled={loading}
                className="flex items-center justify-center space-x-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 disabled:opacity-60 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-[110px]"
                aria-label={`Follow ${user.name}`}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <UserPlus size={16} />
                )}
                <span>{loading ? "..." : "Follow"}</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NetworkCard;
