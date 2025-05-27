import React from "react";
import { User as UserIcon, UserPlus, UserMinus } from "lucide-react";
import { NetworkUser } from "../../types/networkUser";
import { Link } from "react-router-dom";

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* Card Header with optional banner background */}
      <div className="h-12 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

      <div className="p-6">
        {/* Profile Section */}
        <Link to={`/in/${user.username}`}>
          <div className="flex items-start space-x-4">
            <div className="relative -mt-10">
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

            <div className="flex-1 pt-2">
              <h2 className="text-lg font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-gray-600">@{user.username}</p>
            </div>
          </div>

          {/* Headline */}
          {user.headline && (
            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
              {user.headline}
            </p>
          )}

          {/* Action Button */}
          <div className="mt-4 flex justify-end">
            {isFollowing ? (
              <button
                onClick={() => onUnfollow(user._id)}
                className="flex items-center space-x-1 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors duration-300"
                aria-label={`Unfollow ${user.name}`}
              >
                <UserMinus size={16} />
                <span>Unfollow</span>
              </button>
            ) : (
              <button
                onClick={() => onFollow(user._id)}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-300"
                aria-label={`Follow ${user.name}`}
              >
                <UserPlus size={16} />
                <span>Follow</span>
              </button>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NetworkCard;
