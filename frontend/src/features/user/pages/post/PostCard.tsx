"use client";

import { useState } from "react";
import {
  Heart as HeartIcon,
  MessageSquare as CommentIcon,
  Share2 as ShareIcon,
  Bookmark as BookmarkIcon,
  MoreHorizontal as MoreIcon,
  ThumbsUp as LikeIcon,
  Send as SendIcon,
} from "react-feather";
import PostComments from "./PostComment";
import PostMedia from "./PostMedia";

const PostCard = ({ post: any }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [likeAnimation, setLikeAnimation] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
      setLikeAnimation(true);
      setTimeout(() => setLikeAnimation(false), 700);
    }
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Post header */}
      <div className="p-4 flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar || "/placeholder.svg"}
            alt={post.author.name}
            className="h-10 w-10 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
            <div className="flex items-center text-gray-500 text-sm">
              <span>{post.author.role}</span>
              <span className="mx-1">•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <MoreIcon size={20} />
        </button>
      </div>

      {/* Post content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
      </div>

      {/* Post media */}
      {post.media && (
        <div className="mb-3">
          <PostMedia media={post.media} />
        </div>
      )}

      {/* Post stats */}
      <div className="px-4 py-2 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
        <div className="flex items-center">
          <div className={`relative ${likeAnimation ? "animate-like" : ""}`}>
            <div className="flex items-center">
              <div className="bg-blue-100 p-1 rounded-full">
                <LikeIcon size={12} className="text-blue-600" />
              </div>
              <span className="ml-1">{likeCount}</span>
            </div>
            {likeAnimation && (
              <div className="absolute -top-2 -left-2 text-blue-600 animate-ping-once">
                <LikeIcon size={16} />
              </div>
            )}
          </div>
          <span className="mx-2">•</span>
          <span>{post.comments} comments</span>
          <span className="mx-2">•</span>
          <span>{post.shares} shares</span>
        </div>
        <button
          onClick={handleSave}
          className={`p-1 rounded-full transition-colors ${
            isSaved ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <BookmarkIcon size={16} className={isSaved ? "fill-current" : ""} />
        </button>
      </div>

      {/* Post actions */}
      <div className="px-2 py-1 border-t border-gray-200 flex justify-around">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center py-2 px-4 rounded-md transition-colors flex-1 ${
            isLiked
              ? "text-blue-600 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <HeartIcon
            size={18}
            className={`mr-2 ${isLiked ? "fill-current" : ""}`}
          />
          <span>Like</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center justify-center py-2 px-4 rounded-md text-gray-600 hover:bg-gray-50 transition-colors flex-1"
        >
          <CommentIcon size={18} className="mr-2" />
          <span>Comment</span>
        </button>
        <button className="flex items-center justify-center py-2 px-4 rounded-md text-gray-600 hover:bg-gray-50 transition-colors flex-1">
          <ShareIcon size={18} className="mr-2" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="border-t border-gray-200 p-4">
          <PostComments postId={post.id} commentCount={post.comments} />

          <div className="mt-3 flex items-center">
            <img
              src="/placeholder.svg?height=150&width=150"
              alt="Your avatar"
              className="h-8 w-8 rounded-full object-cover border border-gray-200 mr-2"
            />
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 transition-colors">
                <SendIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
