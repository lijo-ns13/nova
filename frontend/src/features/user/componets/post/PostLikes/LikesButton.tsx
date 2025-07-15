import React, { useState } from "react";
import { Heart, Loader } from "lucide-react";
import PostLikesModal from "./PostLikesModal";
import useFetchLikes from "./useFetchLikes";

interface LikesButtonProps {
  postId: string;
  likeCount: number;
  liked: boolean;
  isLikeAnimating: boolean;
  onLike: () => Promise<void>;
}

const LikesButton: React.FC<LikesButtonProps> = ({
  postId,
  likeCount,
  liked,
  isLikeAnimating,
  onLike,
}) => {
  const [showLikesModal, setShowLikesModal] = useState<boolean>(false);
  const { likes, isLoading, error, fetchLikes } = useFetchLikes(postId);

  const handleLikeClick = async () => {
    await onLike();
  };

  const handleShowLikes = async () => {
    if (likeCount > 0) {
      await fetchLikes();
      setShowLikesModal(true);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={handleLikeClick}
          className={`group flex items-center transition-all ${
            liked
              ? "text-pink-500"
              : "text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-500"
          }`}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <span className="relative">
            <Heart
              className={`h-5 w-5 transition-all duration-300 ${
                liked ? "fill-current scale-110" : "group-hover:scale-110"
              }`}
            />
            {isLikeAnimating && (
              <span className="absolute -inset-1 animate-ping opacity-75 h-7 w-7 rounded-full bg-pink-400"></span>
            )}
          </span>
        </button>

        <button
          onClick={handleShowLikes}
          className={`text-sm font-medium ${
            likeCount > 0
              ? "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              : "text-gray-500 dark:text-gray-400"
          } transition-colors ${
            likeCount > 0 ? "cursor-pointer" : "cursor-default"
          }`}
          disabled={likeCount === 0 || isLoading}
        >
          {isLoading ? (
            <Loader size={14} className="animate-spin" />
          ) : (
            likeCount
          )}
        </button>
      </div>

      <PostLikesModal
        likes={likes}
        isOpen={showLikesModal}
        onClose={() => setShowLikesModal(false)}
      />
    </>
  );
};

export default LikesButton;
