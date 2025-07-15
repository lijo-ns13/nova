import React from "react";
import { X } from "lucide-react";
import Avatar from "../../ui/Avatar";
import { Link } from "react-router-dom";
import { SecureCloudinaryImage } from "../../../../../components/SecureCloudinaryImage";
import { LikeResponseDTO } from "../../../types/commentlike";
// interface LikeResponseDTO {
//     _id: string;
//     createdAt: string;
//     user: {
//         id: string;
//         name: string;
//         username: string;
//         profilePicture: string;
//     };
// }


interface PostLikesModalProps {
  likes: LikeResponseDTO[];
  isOpen: boolean;
  onClose: () => void;
}

const PostLikesModal: React.FC<PostLikesModalProps> = ({
  likes,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Filter out likes with null userId
  const validLikes = likes.filter((like) => like.user.id !== null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Liked by {validLikes.length}{" "}
            {validLikes.length === 1 ? "person" : "people"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-1 max-h-[60vh] overflow-y-auto">
          {validLikes.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              No likes yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {validLikes.map((like) => (
                <li
                  key={like._id}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <Link
                    to={`/in/${like.user?.username}`}
                    className="flex items-center space-x-3"
                  >
                    <Avatar
                      src={like.user?.profilePicture}
                      alt={like.user?.name || "User"}
                      size="sm"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {like.user?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        @{like.user?.username || "deleted-user"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostLikesModal;
