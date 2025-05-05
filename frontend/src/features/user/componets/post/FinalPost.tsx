import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  Download,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import CommentSection from "./CommentSection";

interface Media {
  mediaUrl: string;
  mimeType: string;
}

interface User {
  _id: string;
  name: string;
  profilePicture: string;
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

interface PostProps {
  post: Post;
  currentUserId: string;
  onLike?: (postId: string) => Promise<void>;
}

const FinalPost: React.FC<PostProps> = ({ post, currentUserId, onLike }) => {
  const [likeCount, setLikeCount] = useState<number>(post.Likes.length);
  const [liked, setLiked] = useState<boolean>(
    post.Likes.some((like) => like.userId === currentUserId)
  );
  const [expandedMedia, setExpandedMedia] = useState<string | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState<boolean>(false);

  const handleLike = async () => {
    try {
      if (onLike) {
        await onLike(post._id);
      }

      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 1000);

      setLiked(!liked);
      setLikeCount((prev) => prev + (liked ? -1 : 1));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleMediaAction = (url: string, action: "expand" | "download") => {
    if (action === "expand") {
      setExpandedMedia(url);
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleNextMedia = () => {
    if (post.mediaUrls.length > 1) {
      setCurrentMediaIndex(
        (prevIndex) => (prevIndex + 1) % post.mediaUrls.length
      );
    }
  };

  const handlePrevMedia = () => {
    if (post.mediaUrls.length > 1) {
      setCurrentMediaIndex(
        (prevIndex) =>
          (prevIndex - 1 + post.mediaUrls.length) % post.mediaUrls.length
      );
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 my-6 border border-gray-200 dark:border-gray-700 transform hover:translate-y-[-2px]">
      {/* Post Header */}
      <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-700">
        <Avatar
          src={post.creatorId.profilePicture}
          alt={post.creatorId.name}
          size="md"
          bordered
        />
        <div className="ml-3 flex-1">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
            {post.creatorId.name}
          </h3>
          <p className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            {formatDate(post.createdAt)}
          </p>
        </div>
        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full p-2 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line">
          {post.description}
        </p>
      </div>

      {/* Media Content */}
      {post.mediaUrls.length > 0 && (
        <div className="relative bg-gray-100 dark:bg-gray-900 group">
          {post.mediaUrls.length > 1 && (
            <button
              onClick={handlePrevMedia}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous media"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div className="flex justify-center items-center">
            {post.mediaUrls.map((media, index) => (
              <div
                key={index}
                className={`w-full ${
                  index === currentMediaIndex ? "block" : "hidden"
                }`}
              >
                {media.mimeType.startsWith("image") ? (
                  <div className="relative group/image">
                    <img
                      src={media.mediaUrl}
                      alt={`Media ${index + 1}`}
                      className="w-full max-h-[500px] object-contain cursor-pointer"
                      onClick={() =>
                        handleMediaAction(media.mediaUrl, "expand")
                      }
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() =>
                          handleMediaAction(media.mediaUrl, "expand")
                        }
                        className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                      >
                        <Maximize2 size={16} />
                      </button>
                      <button
                        onClick={() =>
                          handleMediaAction(media.mediaUrl, "download")
                        }
                        className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ) : media.mimeType === "application/pdf" ? (
                  <div className="py-10 px-4 text-center bg-gray-50 dark:bg-gray-800">
                    <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-sm mx-auto max-w-md">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        PDF Document
                      </h3>
                      <p className="text-gray-500 dark:text-gray-300 text-sm mb-4">
                        View or download the attached PDF document
                      </p>
                      <Button
                        variant="primary"
                        icon={<Download size={16} />}
                        onClick={() => window.open(media.mediaUrl, "_blank")}
                      >
                        View PDF
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {post.mediaUrls.length > 1 && (
            <button
              onClick={handleNextMedia}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next media"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {post.mediaUrls.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
              {post.mediaUrls.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentMediaIndex
                      ? "bg-indigo-500 scale-125 w-3"
                      : "bg-white/40 hover:bg-white/70"
                  }`}
                  onClick={() => setCurrentMediaIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expanded Media Overlay */}
      {expandedMedia && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedMedia(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandedMedia(null);
            }}
            className="absolute top-4 right-4 text-white hover:text-indigo-400 transition-colors bg-black/30 rounded-full p-2"
            aria-label="Close expanded view"
          >
            <X size={24} />
          </button>
          <img
            src={expandedMedia}
            alt="Expanded media"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={handleLike}
              className={`group flex items-center gap-2 transition-all ${
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
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            <button
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              onClick={toggleComments}
              aria-label="Show comments"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Comments</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors hover:scale-110"
              aria-label="Share post"
            >
              <Share className="h-5 w-5" />
            </button>
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors hover:scale-110"
              aria-label="Save post"
            >
              <Bookmark className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection postId={post._id} currentUserId={currentUserId} />
      )}
    </div>
  );
};

export default FinalPost;
