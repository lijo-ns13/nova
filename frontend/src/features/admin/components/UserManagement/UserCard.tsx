import React from "react";
import { User } from "../../types/userTypes";
import StatusBadge from "./StatusBadge";
import UserAvatar from "./UserAvatar";

interface UserCardProps {
  user: User;
  onBlock: (userId: string) => void;
  onUnblock: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onBlock, onUnblock }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <UserAvatar name={user.name} imageSrc={user.profilePicture} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
          <div className="mt-2">
            <StatusBadge isBlocked={user.isBlocked} />
          </div>
        </div>

        <div>
          {user.isBlocked ? (
            <button
              onClick={() => onUnblock(user._id)}
              className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Unblock
            </button>
          ) : (
            <button
              onClick={() => onBlock(user._id)}
              className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Block
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
