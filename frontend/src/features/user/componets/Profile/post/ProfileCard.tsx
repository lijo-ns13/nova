import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
}

interface Media {
  mediaUrl: string;
  mimeType: string;
}

interface ILike {
  _id: string;
  postId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Post {
  _id: string;
  creatorId: User;
  description: string;
  mediaUrls: Media[];
  createdAt: string;
  Likes: ILike[];
}

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onLike: (postId: string) => Promise<void>;
  onDelete?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onLike,
  onDelete,
}) => {
  const [liked, setLiked] = useState(
    post.Likes.some((like) => like.userId === currentUserId)
  );
  const [likeCount, setLikeCount] = useState(post.Likes.length);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Handle like action
  const handleLike = async () => {
    try {
      await onLike(post._id);

      // Toggle liked state and update count
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

      // Trigger animation
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 1000);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Handle media navigation
  const nextMedia = () => {
    if (post.mediaUrls.length > 1) {
      setCurrentMediaIndex((prev) => (prev + 1) % post.mediaUrls.length);
    }
  };

  const prevMedia = () => {
    if (post.mediaUrls.length > 1) {
      setCurrentMediaIndex(
        (prev) => (prev - 1 + post.mediaUrls.length) % post.mediaUrls.length
      );
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Post header */}
      <div className="p-4 flex items-center">
        <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
          <img
            src={post.creatorId.profilePicture}
            alt={post.creatorId.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="ml-3 flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white">
            {post.creatorId.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(post.createdAt)}
          </p>
        </div>

        <div className="relative">
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full">
            <MoreHorizontal size={18} />
          </button>

          {onDelete && (
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block">
              <button
                onClick={() => onDelete(post._id)}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 dark:text-gray-200 text-sm">
          {post.description}
        </p>
      </div>

      {/* Media content */}
      {post.mediaUrls.length > 0 && (
        <div className="relative">
          {/* Media display */}
          <div className="bg-gray-100 dark:bg-gray-900 aspect-[16/9] overflow-hidden">
            <img
              src={post.mediaUrls[currentMediaIndex].mediaUrl}
              alt={`Post image ${currentMediaIndex + 1}`}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Navigation controls for multiple media */}
          {post.mediaUrls.length > 1 && (
            <>
              {/* Media navigation buttons */}
              <button
                onClick={prevMedia}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-1.5 hover:bg-black/50 transition-colors"
                aria-label="Previous media"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={nextMedia}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-1.5 hover:bg-black/50 transition-colors"
                aria-label="Next media"
              >
                <ChevronRight size={18} />
              </button>

              {/* Media indicators */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                {post.mediaUrls.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentMediaIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Post actions */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1.5 ${
            liked
              ? "text-red-500 dark:text-red-400"
              : "text-gray-500 dark:text-gray-400"
          } hover:text-red-600 dark:hover:text-red-500 transition-colors`}
        >
          <Heart
            size={18}
            className={`${liked ? "fill-current" : ""} ${
              isLikeAnimating ? "animate-heartbeat" : ""
            }`}
          />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-medium">Comments</span>
        </button>
      </div>

      {/* Comments section (placeholder) */}
      {showComments && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              <img
                src={post.creatorId.profilePicture}
                alt="Your profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Write a comment..."
                className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-full border-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
            </div>
          </div>

          <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
            Comments are loading...
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
