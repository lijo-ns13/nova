import React, { useState } from "react";
import BaseModal from "./BaseModal";
import {
  followUser,
  NetworkUserGetUsers,
  unFollowUser,
} from "../../services/FollowService";

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: NetworkUserGetUsers[];
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
  // (optional) keep local state so the UI feels snappy
  const [pending, setPending] = useState<string | null>(null);
  console.log("users list", users);
  const handleFollowToggle = async (userId: string, isFollowing?: boolean) => {
    try {
      setPending(userId);
      isFollowing ? await unFollowUser(userId) : await followUser(userId);
      refetch(); // refresh data from the server
    } catch (err) {
      console.error("Error toggling follow status:", err);
    } finally {
      setPending(null);
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
              <li key={user.user._id} className="py-4">
                <div className="flex items-center justify-between">
                  {/* avatar + meta */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        user.user.profilePicture?.trim()
                          ? user.user.profilePicture
                          : "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(user.user.name)
                      }
                      alt={user.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div>
                      <p className="font-medium text-gray-900">
                        {user.user.name}
                      </p>
                      {user.user.username && (
                        <p className="text-sm text-gray-500">
                          @{user.user.username}
                        </p>
                      )}
                      {user.user.headline && (
                        <p className="text-sm text-gray-500">
                          {user.user.headline}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* follow / unfollow */}
                  {user.user._id !== currentUserId && (
                    <button
                      disabled={pending === user.user._id}
                      onClick={() =>
                        handleFollowToggle(user.user._id, user.isFollowing)
                      }
                      className={`px-4 py-1 rounded-full text-sm font-medium transition-colors
                        ${
                          user.isFollowing
                            ? "border border-gray-300 text-gray-700 hover:bg-gray-100"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }
                        ${
                          pending === user.user._id &&
                          "opacity-60 cursor-not-allowed"
                        }
                      `}
                    >
                      {user.isFollowing ? "Unfollow" : "Follow"}
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
