import React, { useState, useEffect } from "react";
import {
  FiSend,
  FiHeart,
  FiMoreHorizontal,
  FiTrash2,
  FiFlag,
} from "react-icons/fi";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { AddComment, fetchComments } from "../../services/PostService";
import { AxiosError } from "axios";

interface Comment {
  _id: string;
  postId: string;
  authorId: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  parentId: string | null;
  authorName: string;
  likes: string[];
  content: string;
  createdAt: string;
  likeCount: number;
  updatedAt: string;
  repliesCount: number;
}

interface CommentSectionProps {
  postId: string;
  currentUserId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  currentUserId,
}) => {
  const { name: authorName } = useAppSelector((state) => state.auth);
  const [comments, setComments] = useState<Comment[]>([]);

  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  console.log("comments", comments);
  const loadComments = async (page: number, initialLoad = false) => {
    if (initialLoad) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const res = await fetchComments(postId, page);
      console.log("res");
      if (!res) {
        throw new Error("error occured find out");
      }
      setComments((prev) =>
        initialLoad ? res.comments : [...prev, ...res.comments]
      );
      setTotalPages(res.totalPages);
      setCurrentPage(res.currentPage);
    } catch (error) {
      console.error("Error loading comments:", (error as Error).message);
    } finally {
      if (initialLoad) setIsLoading(false);
      else setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadComments(1, true);
  }, [postId]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        !isLoadingMore &&
        currentPage < totalPages
      ) {
        loadComments(currentPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoadingMore, currentPage, totalPages]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await AddComment(postId, newComment, null, authorName);
      console.log("adding comment ", res);
      setComments((prev) => [res, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment._id === commentId) {
          const isLiked = comment.likes.includes(currentUserId);
          return {
            ...comment,
            likes: isLiked
              ? comment.likes.filter((id) => id !== currentUserId)
              : [...comment.likes, currentUserId],
            likeCount: isLiked ? comment.likeCount - 1 : comment.likeCount + 1,
          };
        }
        return comment;
      })
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((comment) => comment._id !== commentId));
  };

  const formatTimeAgo = (dateString: string) => {
    // Existing time formatting logic
    return "hll";
  };

  return (
    <div className="p-4 border-t border-white/5 bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-b-xl">
      <h3 className="text-base font-semibold text-white mb-4">Comments</h3>

      <form onSubmit={handleSubmitComment} className="relative mb-5">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-white/20 transition-all"
        />
        <button
          type="submit"
          className={`absolute right-1 top-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            !newComment.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-lg hover:shadow-pink-500/20"
          }`}
          disabled={!newComment.trim()}
        >
          <FiSend className="w-4 h-4" />
        </button>
      </form>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-white/5 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-6 text-gray-400 italic">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment: Comment) => (
            <div key={comment?._id} className="flex gap-3 group">
              <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={
                    comment?.authorId?.profilePicture || "/placeholder-user.jpg"
                  }
                  alt={comment?.authorId?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="bg-white/5 rounded-2xl px-4 py-3">
                  <div className="mb-1">
                    <span className="font-semibold text-white text-sm">
                      {comment?.authorId?.name}
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm break-words">
                    {comment?.content}
                  </p>
                </div>
                <div className="flex items-center gap-3 px-2 mt-1 text-xs">
                  <button
                    className={`flex items-center gap-1 transition-colors ${
                      comment?.likes.includes(currentUserId)
                        ? "text-pink-500"
                        : "text-gray-400 hover:text-pink-400"
                    }`}
                    onClick={() => handleLikeComment(comment?._id)}
                  >
                    <FiHeart
                      className={`w-3 h-3 ${
                        comment?.likes.includes(currentUserId)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                    {comment?.likeCount > 0 && (
                      <span>{comment?.likeCount}</span>
                    )}
                  </button>
                  <span className="text-gray-500">
                    {formatTimeAgo(comment?.createdAt)}
                  </span>

                  <div className="relative ml-auto">
                    <button className="text-gray-500 hover:text-white p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                      <FiMoreHorizontal className="w-4 h-4" />
                    </button>

                    <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 w-32 hidden group-hover:block z-10">
                      {comment?.authorId?._id === currentUserId ? (
                        <button
                          className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-pink-500 hover:bg-gray-700/50"
                          onClick={() => handleDeleteComment(comment?._id)}
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      ) : (
                        <button className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-yellow-500 hover:bg-gray-700/50">
                          <FiFlag className="w-4 h-4" />
                          <span>Report</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="h-8 w-8 border-2 border-pink-500 rounded-full animate-spin border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
