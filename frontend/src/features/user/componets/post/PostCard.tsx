import React, { useState } from "react";
import {
  FiHeart,
  FiMessageSquare,
  FiShare2,
  FiBookmark,
  FiGlobe,
  FiDownload,
  FiMaximize,
} from "react-icons/fi";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import axios from "axios";
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
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { id: currentUserId } = useAppSelector((state) => state.auth);
  const [likeCount, setLikeCount] = useState<number>(post.Likes.length);
  const [liked, setLiked] = useState<boolean>(
    post.Likes.some((like) => like.userId === currentUserId)
  );
  const [expandedMedia, setExpandedMedia] = useState<string | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);

  const handleLike = async () => {
    const res = await userAxios.post(
      `http://localhost:3000/post/like/${post._id}`,
      {
        withCredentials: true,
      }
    );
    console.log("res for like", res);
    setLiked(!liked);
    setLikeCount(likeCount + (liked ? -1 : 1));
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

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.005] transition-all duration-300 my-6 max-w-2xl w-full mx-auto">
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-purple-500 hover:border-pink-400 transition-colors duration-300">
            <img
              src={post.creatorId.profilePicture || "/placeholder-user.jpg"}
              alt={post.creatorId.name}
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white hover:text-pink-400 transition-colors cursor-pointer">
              {post.creatorId.name}
            </h3>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <FiGlobe className="h-3 w-3" />
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>

        <p className="mt-3 text-gray-300 leading-relaxed">{post.description}</p>
      </div>

      {post.mediaUrls.length > 0 && (
        <div className="relative group flex items-center justify-center gap-4">
          <button
            onClick={handlePrevMedia}
            className="absolute left-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            <FiMaximize className="h-6 w-6 rotate-180" />
          </button>

          {post.mediaUrls.map((media, index) => (
            <div
              key={index}
              className={`relative ${
                index === currentMediaIndex ? "block" : "hidden"
              }`}
            >
              {media.mimeType.startsWith("image") ? (
                <img
                  src={media.mediaUrl || "/placeholder-media.jpg"}
                  alt={`Media ${index}`}
                  className="w-full max-h-80 object-contain cursor-pointer"
                  onClick={() => handleMediaAction(media.mediaUrl, "expand")}
                  loading="lazy"
                />
              ) : media.mimeType === "application/pdf" ? (
                <div className="text-center p-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-red-400 mx-auto mb-4"
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
                      className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition-colors duration-300"
                    >
                      <FiDownload className="h-4 w-4" />
                      <span>View PDF</span>
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          ))}

          <button
            onClick={handleNextMedia}
            className="absolute right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
          >
            <FiMaximize className="h-6 w-6" />
          </button>
        </div>
      )}

      {expandedMedia && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <button
            onClick={() => setExpandedMedia(null)}
            className="absolute top-4 right-4 text-white hover:text-pink-400 transition-colors"
          >
            <FiMaximize className="h-8 w-8" />
          </button>
          <img
            src={expandedMedia}
            alt="Expanded media"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-all ${
                liked ? "text-pink-500" : "text-white hover:text-pink-400"
              }`}
            >
              <FiHeart
                className={`h-6 w-6 transition-transform ${
                  liked ? "fill-current scale-125" : ""
                }`}
              />
              <span className="font-medium">{likeCount}</span>
            </button>
            <button className="flex items-center gap-2 text-white hover:text-pink-400 transition-colors">
              <FiMessageSquare className="h-6 w-6" />
              <span className="font-medium">Comment</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-white hover:text-pink-400 transition-colors hover:scale-110">
              <FiShare2 className="h-6 w-6" />
            </button>
            <button className="text-white hover:text-pink-400 transition-colors hover:scale-110">
              <FiBookmark className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
