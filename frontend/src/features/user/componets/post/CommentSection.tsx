import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  MoreHorizontal,
  Send,
  Reply,
  Flag,
  Trash2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Pencil,
  X,
} from "lucide-react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import {
  AddComment,
  fetchComments,
  toggleCommentLike,
  updateComment as updateCommentAPI,
  deleteComment as deleteCommentAPI,
} from "../../services/PostService";

interface CommentAuthor {
  _id: string;
  name: string;
  profilePicture: string;
  username: string;
}

interface Comment {
  _id: string;
  postId: string;
  authorId: CommentAuthor;
  parentId: string | null;
  authorName: string;
  likes: string[];
  content: string;
  createdAt: string;
  likeCount: number;
  updatedAt: string;
  repliesCount: number;
  replies?: Comment[];
  isExpanded?: boolean;
}

interface CommentSectionProps {
  postId: string;
  currentUserId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  currentUserId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const replyInputRef = useRef<HTMLInputElement>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const { name: authorName } = useAppSelector((state) => state.auth);
  // Mock function to simulate API call for comments
  const fetchComment = async (
    postId: string,
    page: number,
    initialLoad = false
  ) => {
    console.log(initialLoad);
    // This would be replaced with your actual API call
    try {
      const response = await fetchComments(postId, page);
      console.log("responscomemnts", response);
      if (!response) throw new Error("Failed to fetch comments");

      const data = response;
      console.log("datacomments", data);
      return {
        comments: data.comments || [],
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1,
      };
    } catch (error) {
      console.log("Error fetching comments:", error);
      return { comments: [], totalPages: 1, currentPage: 1 };
    }
  };

  // Mock function to simulate adding a comment
  const addComments = async (
    content: string,
    parentId: string | null = null
  ) => {
    try {
      const response = await AddComment(postId, content, parentId, authorName);
      console.log("addcomement resos", response);
      if (!response) throw new Error("Failed to add comment");
      return response;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        const res = await fetchComment(postId, 1, true);

        // Process comments to identify parent-child relationships
        const processedComments = processCommentsHierarchy(res.comments);

        setComments(processedComments);
        console.log("comments", comments);
        setTotalPages(res.totalPages);
        setCurrentPage(res.currentPage);
      } catch (error) {
        console.error("Error loading comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  // Process comments to build a hierarchy
  const processCommentsHierarchy = (commentsArray: Comment[]): Comment[] => {
    const commentMap: Record<string, Comment> = {};
    const rootComments: Comment[] = [];

    // First pass: create a map and initialize replies arrays
    commentsArray.forEach((comment) => {
      const enhancedComment = {
        ...comment,
        replies: [],
        isExpanded: true,
      };
      commentMap[comment._id] = enhancedComment;
    });

    // Second pass: establish parent-child relationships
    commentsArray.forEach((comment) => {
      if (comment.parentId && commentMap[comment.parentId]) {
        commentMap[comment.parentId].replies?.push(commentMap[comment._id]);
      } else {
        rootComments.push(commentMap[comment._id]);
      }
    });

    return rootComments;
  };

  const loadMoreComments = async () => {
    if (currentPage >= totalPages) return;

    setIsLoadingMore(true);
    try {
      const res = await fetchComments(postId, currentPage + 1);
      const newProcessedComments = processCommentsHierarchy(res.comments);

      setComments((prev) => [...prev, ...newProcessedComments]);
      setCurrentPage(res.currentPage);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Error loading more comments:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const newCommentData: any = await addComments(newComment);
      console.log("button clicked=>res", newCommentData);

      // Add the new comment to the state
      // Create the enhanced comment with empty replies array and expanded flag
      const enhancedComment = {
        ...newCommentData,
        replies: [],
        isExpanded: true,
      };
      setComments((prev) => [enhancedComment, ...prev]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    console.log("clicked");
    e.preventDefault();
    if (!replyContent.trim() || !parentId) return;

    try {
      const res: any = await addComments(replyContent, parentId);
      console.log("resnested", res);
      const newReply = {
        ...res,
        replies: [],
        isExpanded: true,
      };

      // Update the comments state to include the new reply
      setComments((prev) => {
        return updateCommentsWithNewReply(prev, parentId, newReply);
      });

      setReplyingTo(null);
      setReplyContent("");
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const updateCommentsWithNewReply = (
    comments: Comment[],
    parentId: string,
    newReply: Comment
  ): Comment[] => {
    return comments.map((comment) => {
      if (comment._id === parentId) {
        return {
          ...comment,
          replies: [newReply, ...(comment.replies || [])],
          repliesCount: (comment.repliesCount || 0) + 1,
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentsWithNewReply(
            comment.replies,
            parentId,
            newReply
          ),
        };
      }
      return comment;
    });
  };

  const toggleReplying = (commentId: string | null) => {
    console.log("togle");
    setReplyingTo((prev) => (prev === commentId ? null : commentId));
    setReplyContent("");

    // Focus the reply input when showing it
    if (commentId && commentId !== replyingTo) {
      setTimeout(() => {
        if (replyInputRef.current) {
          replyInputRef.current.focus();
        }
      }, 10);
    }
  };

  const toggleReplies = (commentId: string) => {
    setComments((prev) => {
      return toggleCommentReplies(prev, commentId);
    });
  };

  const toggleCommentReplies = (
    comments: Comment[],
    commentId: string
  ): Comment[] => {
    return comments.map((comment) => {
      if (comment._id === commentId) {
        return {
          ...comment,
          isExpanded: !comment.isExpanded,
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: toggleCommentReplies(comment.replies, commentId),
        };
      }
      return comment;
    });
  };

  const likeComment = (comments: Comment[], commentId: string): Comment[] => {
    return comments.map((comment) => {
      if (comment._id === commentId) {
        const isLiked = comment.likes.includes(currentUserId);
        return {
          ...comment,
          likes: isLiked
            ? comment.likes.filter((id) => id !== currentUserId)
            : [...comment.likes, currentUserId],
          likeCount: isLiked ? comment.likeCount - 1 : comment.likeCount + 1,
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: likeComment(comment.replies, commentId),
        };
      }
      return comment;
    });
  };

  const deleteComment = (comments: Comment[], commentId: string): Comment[] => {
    return comments.filter((comment) => {
      if (comment._id === commentId) {
        return false;
      } else if (comment.replies && comment.replies.length > 0) {
        comment.replies = deleteComment(comment.replies, commentId);
        return true;
      }
      return true;
    });
  };
  const handleLikeComment = async (commentId: string) => {
    try {
      await toggleCommentLike(commentId);
      setComments((prev) => likeComment(prev, commentId));
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteCommentAPI(commentId);
      setComments((prev) => deleteComment(prev, commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - commentDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 604800)}w ago`;

    return commentDate.toLocaleDateString();
  };
  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment._id);
    setEditContent(comment.content);
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 10);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditContent("");
  };
  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await updateCommentAPI(commentId, editContent);
      setComments((prev) => updateCommentInState(prev, commentId, editContent));
      cancelEditing();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  const updateCommentInState = (
    comments: Comment[],
    commentId: string,
    newContent: string
  ): Comment[] => {
    return comments.map((comment) => {
      if (comment._id === commentId) {
        return {
          ...comment,
          content: newContent,
          updatedAt: new Date().toISOString(),
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentInState(comment.replies, commentId, newContent),
        };
      }
      return comment;
    });
  };
  // Recursive comment rendering component
  const CommentItem = ({
    comment,
    level = 0,
  }: {
    comment: Comment;
    level?: number;
  }) => {
    const isAuthor = comment?.authorId?._id === currentUserId;
    const hasReplies = comment.repliesCount > 0;
    const isReplying = replyingTo === comment?._id;
    const isEditing = editingCommentId === comment._id;

    return (
      <div
        className={`group animate-fadeIn ${
          level > 0
            ? "pl-4 md:pl-8 border-l border-gray-200 dark:border-gray-700"
            : ""
        }`}
      >
        <div className="flex gap-3">
          <Avatar
            src={comment?.authorId?.profilePicture}
            alt={comment?.authorId?.name}
            size="sm"
          />
          <div className="flex-1">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl px-4 py-3 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {comment?.authorId?.name}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(comment.createdAt)}
                </span>
              </div>

              {isEditing ? (
                <div className="relative">
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-3 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      onClick={() => handleUpdateComment(comment._id)}
                      className="text-green-500 hover:text-green-600 p-1"
                      disabled={!editContent.trim()}
                    >
                      <Send size={14} />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="text-gray-400 hover:text-gray-500 p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 text-sm break-words whitespace-pre-line">
                  {comment?.content}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 px-2 mt-1.5 text-xs">
              <button
                className={`flex items-center gap-1 transition-colors ${
                  comment.likes.includes(currentUserId)
                    ? "text-pink-500"
                    : "text-gray-500 dark:text-gray-400 hover:text-pink-400"
                }`}
                onClick={() => handleLikeComment(comment._id)}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    comment.likes.includes(currentUserId) ? "fill-current" : ""
                  }`}
                />
                {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
              </button>

              <button
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-indigo-500"
                onClick={() => toggleReplying(comment._id)}
              >
                <Reply className="w-3.5 h-3.5" />
                <span>Reply</span>
              </button>

              {hasReplies && (
                <button
                  className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-indigo-500"
                  onClick={() => toggleReplies(comment._id)}
                >
                  {comment.isExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      <span>Hide replies</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      <span>Show replies ({comment.repliesCount})</span>
                    </>
                  )}
                </button>
              )}

              <div className="relative ml-auto">
                <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 w-32 hidden group-hover:block z-10">
                  {isAuthor ? (
                    <>
                      <button
                        className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        onClick={() => startEditing(comment)}
                      >
                        <Pencil className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </>
                  ) : (
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                      <Flag className="w-4 h-4" />
                      <span>Report</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Reply input */}
            {isReplying && (
              <form
                onSubmit={(e) => handleSubmitReply(e, comment._id)}
                className="mt-3 mb-4"
              >
                <div className="flex gap-2">
                  <Avatar size="xs" alt="Your profile" />
                  <div className="flex-1 relative">
                    <input
                      ref={replyInputRef}
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Reply to ${comment.authorId.name}...`}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full py-2 px-4 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30"
                    />
                    <button
                      type="submit"
                      className={`absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-500 text-white p-1.5 rounded-full ${
                        !replyContent.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-indigo-600"
                      }`}
                      disabled={!replyContent.trim()}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Nested replies */}
        {comment.isExpanded &&
          comment.replies &&
          comment.replies.length > 0 && (
            <div className="mt-3 space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  level={level + 1}
                />
              ))}
            </div>
          )}
      </div>
    );
  };

  return (
    <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        <span>Comments</span>
      </h3>

      <form onSubmit={handleSubmitComment} className="relative mb-6">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full py-2.5 px-4 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-all"
        />
        <button
          type="submit"
          className={`absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-full transition-all ${
            !newComment.trim()
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-md hover:shadow-indigo-500/20"
          }`}
          disabled={!newComment.trim()}
        >
          <Send size={16} />
        </button>
      </form>

      <div className="space-y-5">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3">
                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-8 w-8"></div>
                <div className="flex-1">
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl mb-2"></div>
                  <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 inline-flex flex-col items-center">
              <MessageSquare className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                No comments yet
              </p>
              <p className="text-sm">Be the first to share your thoughts!</p>
            </div>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))
        )}

        {!isLoading && currentPage < totalPages && (
          <div className="text-center pt-2">
            <Button
              variant="ghost"
              onClick={loadMoreComments}
              isLoading={isLoadingMore}
              className="text-indigo-500 hover:text-indigo-600"
            >
              Load more comments
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
