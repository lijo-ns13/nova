import React, { useState, useEffect } from "react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { Send, Edit, Trash2, Reply, Loader } from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import { CommentResponseDTO } from "../../types/commentlike";
import {
  createComment,
  deleteComment,
  getPostComments,
  updateComment,
} from "../../services/PostService";

interface CommentSectionProps {
  postId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  currentUserId,
  currentUserName,
  currentUserAvatar,
}) => {
  const [comments, setComments] = useState<CommentResponseDTO[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch initial comments
  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        const fetchedComments = await getPostComments(postId);
        setComments(fetchedComments);
        setHasMore(fetchedComments.length === 10);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadComments();
  }, [postId]);

  // Load more comments
  const loadMoreComments = async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const newComments = await getPostComments(postId, page + 1);
      setComments((prev) => [...prev, ...newComments]);
      setPage((prev) => prev + 1);
      setHasMore(newComments.length === 10);
    } catch (error) {
      console.error("Failed to load more comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle comment submission
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await createComment({
        postId,
        content: newComment,
        authorName: currentUserName,
      });
      setComments((prev) => [response.data, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  // Handle reply submission
  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    try {
      const response = await createComment({
        postId,
        content: replyContent,
        parentId,
        authorName: currentUserName,
      });
      setComments((prev) => [response.data, ...prev]);
      setReplyingTo(null);
      setReplyContent("");
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  // Handle comment update
  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;
    try {
      const response = await updateComment(commentId, editContent);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? response.data : comment
        )
      );
      setEditingCommentId(null);
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  // Handle comment deletion
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  // Socket.io for real-time updates
  useEffect(() => {
    const handleNewComment = (data: {
      postId: string;
      comment: CommentResponseDTO;
    }) => {
      if (data.postId === postId) {
        setComments((prev) => [data.comment, ...prev]);
      }
    };
  }, [postId]);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      {/* Comments List */}
      <div className="max-h-[50vh] md:max-h-[300px] overflow-y-auto p-4 space-y-4">
        {isLoading && comments.length === 0 ? (
          <div className="flex justify-center py-4">
            <Loader className="animate-spin text-gray-500" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar
                src={currentUserAvatar}
                alt={comment.authorName}
                size="sm"
              />
              <div className="flex-1">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="font-semibold text-sm text-gray-800 dark:text-white">
                        {comment.authorName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    {comment.authorId === currentUserId && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditContent(comment.content);
                          }}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdateComment(comment.id)}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-100 dark:border-gray-600">
                    <button
                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 flex items-center gap-1"
                      onClick={() => {
                        setReplyingTo(
                          replyingTo === comment.id ? null : comment.id
                        );
                        setReplyContent("");
                      }}
                    >
                      <Reply size={14} /> Reply
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {comment.likeCount} likes
                    </span>
                  </div>

                  {replyingTo === comment.id && (
                    <div className="mt-3 pl-3 border-l-2 border-gray-200 dark:border-gray-600">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Write a reply..."
                          className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddReply(comment.id)
                          }
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Send size={14} />}
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!replyContent.trim()}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        {hasMore && (
          <button
            onClick={loadMoreComments}
            disabled={isLoading}
            className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              "Load more comments"
            )}
          </button>
        )}
      </div>

      {/* Comment Input */}
      <div className="p-2 md:p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 items-center">
          <Avatar src={currentUserAvatar} alt={currentUserName} size="sm" />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
          />
          <Button
            variant="primary"
            size="sm"
            icon={<Send size={16} />}
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
