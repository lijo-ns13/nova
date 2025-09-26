import React, { useState } from "react";
import { User } from "../../types/user";
import StatusBadge from "./StatusBadge";
import UserAvatar from "./UserAvatar";

interface UserCardProps {
  user: User;
  onBlock: (userId: string) => void;
  onUnblock: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onBlock, onUnblock }) => {
  const [loading, setLoading] = useState(false);

  const handleBlock = async () => {
    setLoading(true);
    try {
      await onBlock(user.id);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async () => {
    setLoading(true);
    try {
      await onUnblock(user.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <UserAvatar name={user.name} imageSrc={user.profilePicture} />

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
              onClick={handleUnblock}
              disabled={loading}
              className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md text-white ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
            >
              {loading ? "Loading..." : "Unblock"}
            </button>
          ) : (
            <button
              onClick={handleBlock}
              disabled={loading}
              className={`inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-md text-white ${
                loading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors`}
            >
              {loading ? "Loading..." : "Block"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
