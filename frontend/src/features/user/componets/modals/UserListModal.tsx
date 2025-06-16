import React from "react";
import BaseModal from "./BaseModal";
import {
  followUser,
  NetworkUser,
  unFollowUser,
} from "../../services/FollowService";

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: NetworkUser[];
  currentUserId: string;
  refetch: () => void;
}

const UserListModal: React.FC<UserListModalProps> = ({
  isOpen,
  onClose,
  title,
  users,
  currentUserId,
  refetch,
}) => {
  console.log("checking working or not", users, currentUserId, title, refetch);
  const handleFollowToggle = async (userId: string, isFollowing?: boolean) => {
    try {
      if (isFollowing) {
        await unFollowUser(userId);
      } else {
        await followUser(userId);
      }
      refetch();
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="max-h-[70vh] overflow-y-auto">
        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No users to display</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user._id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.profilePicture || "/default-avatar.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      {user.username && (
                        <p className="text-sm text-gray-500">
                          @{user.username}
                        </p>
                      )}
                      {user.headline && (
                        <p className="text-sm text-gray-500">{user.headline}</p>
                      )}
                    </div>
                  </div>
                  {user._id !== currentUserId && (
                    <button
                      onClick={() =>
                        handleFollowToggle(user._id, user.isFollowing)
                      }
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.isFollowing
                          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      } transition-colors`}
                    >
                      {user.isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BaseModal>
  );
};

export default UserListModal;
