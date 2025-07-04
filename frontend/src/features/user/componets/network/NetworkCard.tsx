import React from "react";
import { User as UserIcon, UserPlus, UserMinus } from "lucide-react";

import { Link } from "react-router-dom";
import { NetworkUser } from "../../pages/NetworkPage";
import { SecureCloudinaryImage } from "../../../../components/SecureCloudinaryImage";

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

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFollow(user._id);
  };

  const handleUnfollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onUnfollow(user._id);
  };

  return (
    <div className="h-full flex">
      {" "}
      {/* Flex container for consistent height */}
      <Link
        to={`/in/${user.username}`}
        className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex flex-col w-full"
        aria-label={`View ${user.name}'s profile`}
      >
        {/* Card Header with banner */}
        <div className="h-12 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        {/* Card Content - flex column with fixed button position */}
        <div className="p-6 flex flex-col flex-1">
          {/* Profile Info Section */}
          <div className="flex items-start space-x-4 mb-4">
            <div className="relative -mt-10 flex-shrink-0">
              {user.profilePicture ? (
                // <img
                //   className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-md"
                //   src={user.profilePicture}
                //   alt={user.name}
                // />
                <SecureCloudinaryImage
                  publicId={user.profilePicture}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
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

          {/* Action Button - fixed height and position */}
          <div className="mt-auto h-10 flex justify-end items-center">
            {isFollowing ? (
              <button
                onClick={handleUnfollowClick}
                className="flex items-center justify-center space-x-1 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 w-[110px]"
                aria-label={`Unfollow ${user.name}`}
              >
                <UserMinus size={16} />
                <span>Unfollow</span>
              </button>
            ) : (
              <button
                onClick={handleFollowClick}
                className="flex items-center justify-center space-x-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-[110px]"
                aria-label={`Follow ${user.name}`}
              >
                <UserPlus size={16} />
                <span>Follow</span>
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NetworkCard;
