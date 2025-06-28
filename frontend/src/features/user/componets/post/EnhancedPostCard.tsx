import React, { useState } from "react";
import {
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiBookmark,
  FiGlobe,
  FiDownload,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import CommentSection from "./CommentSection/CommentSection";
import userAxios from "../../../../utils/userAxios";

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

interface PostCardProps {
  post: Post;
  currentUserId: string;
}

const EnhancedPostCard: React.FC<PostCardProps> = ({ post, currentUserId }) => {
  const [likeCount, setLikeCount] = useState<number>(post.Likes.length);
  const [liked, setLiked] = useState<boolean>(
    post.Likes.some((like) => like.userId === currentUserId)
  );
  const [expandedMedia, setExpandedMedia] = useState<string | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
  const [showComments, setShowComments] = useState<boolean>(false);

  const handleLike = async () => {
    try {
      // Replace with your actual API call
      await userAxios.post(`http://localhost:3000/post/like/${post._id}`);

      setLiked(!liked);
      setLikeCount(likeCount + (liked ? -1 : 1));
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
    <div className="bg-gradient-to-b bg-white rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.005] transition-all duration-300 my-6 w-full border border-gray-700/30">
      {/* Post Header */}
      <div className="flex items-center p-4 border-b border-white/5">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-500 hover:border-cyan-400 transition-colors duration-300">
          <img
            src={post.creatorId.profilePicture || "/placeholder-user.jpg"}
            alt={post.creatorId.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            loading="lazy"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-base font-semibold text-black hover:text-pink-400 transition-colors cursor-pointer">
            {post.creatorId.name}
          </h3>
          <p className="flex items-center text-xs text-gray-400">
            <FiGlobe className="w-3 h-3 mr-1" />
            {formatDate(post.createdAt)}
          </p>
        </div>
        <button className="ml-auto text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors">
          •••
        </button>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-black text-sm leading-relaxed">{post.description}</p>
      </div>

      {/* Media Content */}
      {post.mediaUrls.length > 0 && (
        <div className="relative bg-gray-900 flex justify-center items-center">
          {post.mediaUrls.length > 1 && (
            <button
              onClick={handlePrevMedia}
              className="absolute left-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-opacity opacity-0 group-hover:opacity-80 focus:opacity-100"
              aria-label="Previous media"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
          )}

          {post.mediaUrls.map((media, index) => (
            <div
              key={index}
              className={`w-full ${
                index === currentMediaIndex ? "block" : "hidden"
              }`}
            >
              {media.mimeType.startsWith("image") ? (
                <img
                  src={media.mediaUrl || "/placeholder-media.jpg"}
                  alt={`Media ${index}`}
                  className="w-full max-h-[400px] object-contain cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleMediaAction(media.mediaUrl, "expand")}
                  loading="lazy"
                />
              ) : media.mimeType === "application/pdf" ? (
                <div className="py-8 px-4 text-center">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-pink-500 mx-auto mb-4"
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
                    <a
                      href={media.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-pink-500/20"
                    >
                      <FiDownload className="h-4 w-4" />
                      <span>View PDF</span>
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          ))}

          {post.mediaUrls.length > 1 && (
            <button
              onClick={handleNextMedia}
              className="absolute right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-opacity opacity-0 group-hover:opacity-80 focus:opacity-100"
              aria-label="Next media"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          )}

          {post.mediaUrls.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {post.mediaUrls.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentMediaIndex
                      ? "bg-pink-500 scale-125"
                      : "bg-white/30 hover:bg-white/50"
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
            onClick={() => setExpandedMedia(null)}
            className="absolute top-4 right-4 text-white hover:text-pink-400 transition-colors"
            aria-label="Close expanded view"
          >
            <FiX className="h-8 w-8" />
          </button>
          <img
            src={expandedMedia || "/placeholder.svg"}
            alt="Expanded media"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-all ${
                liked ? "text-pink-500" : "text-red hover:text-pink-400"
              }`}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <FiHeart
                className={`h-6 w-6 transition-transform ${
                  liked ? "fill-current scale-125" : ""
                }`}
              />
              <span className="font-medium">{likeCount}</span>
            </button>
            <button
              className="flex items-center gap-2 text-black hover:text-pink-400 transition-colors"
              onClick={toggleComments}
              aria-label="Show comments"
            >
              <FiMessageSquare className="h-6 w-6" />
              <span className="font-medium">Comment</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="text-white hover:text-pink-400 transition-colors hover:scale-110"
              aria-label="Share post"
            >
              <FiShare2 className="h-6 w-6" />
            </button>
            <button
              className="text-white hover:text-pink-400 transition-colors hover:scale-110"
              aria-label="Save post"
            >
              <FiBookmark className="h-6 w-6" />
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

export default EnhancedPostCard;
