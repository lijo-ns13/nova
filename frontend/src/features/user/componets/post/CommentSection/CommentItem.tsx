import React, { useState, useRef } from "react";
import {
  Heart,
  MoreHorizontal,
  Reply,
  Flag,
  Trash2,
  ChevronDown,
  ChevronUp,
  Pencil,
  X,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import Avatar from "../../ui/Avatar";
import CommentInput from "./CommentInput";
import {
  toggleCommentLike,
  updateComment as updateCommentAPI,
  deleteComment as deleteCommentAPI,
} from "../../../services/PostService";
import type { Comment } from "../../../../../types/comment";
import { SecureCloudinaryImage } from "../../../../../components/SecureCloudinaryImage";

interface CommentItemProps {
  comment: Comment;
  level?: number;
  currentUserId: string;
  authorName: string;
  postId: string;
  onNewReply: (parentId: string, replyData: any) => void;
  updateComments: (transformer: (comments: Comment[]) => Comment[]) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  level = 0,
  currentUserId,
  authorName,
  postId,
  onNewReply,
  updateComments,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthor = comment?.authorId?._id === currentUserId;
  const hasReplies = comment.repliesCount > 0;
  const isLiked = comment.likes.includes(currentUserId);

  // Toggle reply state
  const toggleReplying = () => {
    setIsReplying((prev) => !prev);
  };

  // Toggle edit state
  const startEditing = () => {
    setIsEditing(true);
    setEditContent(comment.content);
    setShowMenu(false);
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 10);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  // Toggle reply visibility
  const toggleReplies = () => {
    updateComments((comments) => toggleCommentReplies(comments, comment._id));
  };

  // Toggle comment replies
  const toggleCommentReplies = (
    comments: Comment[],
    commentId: string
  ): Comment[] => {
    return comments.map((c) => {
      if (c._id === commentId) {
        return {
          ...c,
          isExpanded: !c.isExpanded,
        };
      } else if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: toggleCommentReplies(c.replies, commentId),
        };
      }
      return c;
    });
  };

  // Handle like comment
  const handleLikeComment = async () => {
    try {
      await toggleCommentLike(comment._id);
      updateComments((comments) => likeComment(comments, comment._id));
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  // Like comment
  const likeComment = (comments: Comment[], commentId: string): Comment[] => {
    return comments.map((c) => {
      if (c._id === commentId) {
        const isLiked = c.likes.includes(currentUserId);
        return {
          ...c,
          likes: isLiked
            ? c.likes.filter((id) => id !== currentUserId)
            : [...c.likes, currentUserId],
          likeCount: isLiked ? c.likeCount - 1 : c.likeCount + 1,
        };
      } else if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: likeComment(c.replies, commentId),
        };
      }
      return c;
    });
  };

  // Handle update comment
  const handleUpdateComment = async () => {
    if (!editContent.trim()) return;

    try {
      await updateCommentAPI(comment._id, editContent);
      updateComments((comments) =>
        updateCommentInState(comments, comment._id, editContent)
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Update comment in state
  const updateCommentInState = (
    comments: Comment[],
    commentId: string,
    newContent: string
  ): Comment[] => {
    return comments.map((c) => {
      if (c._id === commentId) {
        return {
          ...c,
          content: newContent,
          updatedAt: new Date().toISOString(),
        };
      } else if (c.replies && c.replies.length > 0) {
        return {
          ...c,
          replies: updateCommentInState(c.replies, commentId, newContent),
        };
      }
      return c;
    });
  };

  // Handle delete comment
  const handleDeleteComment = async () => {
    try {
      await deleteCommentAPI(comment._id);
      updateComments((comments) => deleteComment(comments, comment._id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Delete comment
  const deleteComment = (comments: Comment[], commentId: string): Comment[] => {
    return comments.filter((c) => {
      if (c._id === commentId) {
        return false;
      } else if (c.replies && c.replies.length > 0) {
        c.replies = deleteComment(c.replies, commentId);
        return true;
      }
      return true;
    });
  };

  // Toggle the menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Close the menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Format time ago
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

  // Handle new reply
  const handleReplyAdded = (newReplyData: any) => {
    onNewReply(comment._id, newReplyData);
    setIsReplying(false);
  };

  return (
    <div
      className={`group animate-fadeIn ${
        level > 0
          ? "pl-3 sm:pl-4 md:pl-8 border-l border-gray-200 dark:border-gray-700"
          : ""
      }`}
    >
      <div className="flex gap-2 sm:gap-3">
        {/* <Avatar
          src={comment?.authorId?.profilePicture}
          alt={comment?.authorId?.name}
          size="sm"
          className="mt-1 hidden sm:block flex-shrink-0"
        /> */}
        <SecureCloudinaryImage
          publicId={comment?.authorId?.profilePicture}
          className="w-8 h-8 rounded-full object-cover"
        />
        {/* <Avatar
          src={comment?.authorId?.profilePicture}
          alt={comment?.authorId?.name}
          size="xs"
          className="mt-1 sm:hidden flex-shrink-0"
        /> */}
        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl px-3 py-3 sm:px-4 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
            <div className="flex justify-between items-start mb-1.5">
              <Link
                to={`/in/${comment?.authorId?.username}`}
                className="hover:underline"
              >
                <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {comment?.authorId?.name}
                </span>
              </Link>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
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
                    onClick={handleUpdateComment}
                    className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 p-1 transition-colors"
                    disabled={!editContent.trim()}
                  >
                    <Send size={14} />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 transition-colors"
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

          <div className="flex items-center gap-3 sm:gap-4 px-1 mt-1.5 text-xs">
            <button
              className={`flex items-center gap-1 transition-colors ${
                isLiked
                  ? "text-pink-500"
                  : "text-gray-500 dark:text-gray-400 hover:text-pink-400"
              }`}
              onClick={handleLikeComment}
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <Heart
                className={`w-3.5 h-3.5 transform transition-transform ${
                  isLiked ? "fill-current scale-110" : "scale-100"
                }`}
              />
              {comment.likeCount > 0 && (
                <span className="font-medium">{comment.likeCount}</span>
              )}
            </button>

            <button
              className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition-colors"
              onClick={toggleReplying}
            >
              <Reply className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reply</span>
            </button>

            {hasReplies && (
              <button
                className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition-colors"
                onClick={toggleReplies}
              >
                {comment.isExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hide</span>
                    <span className="sm:hidden">
                      Hide {comment.repliesCount}
                    </span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Show replies</span>
                    <span className="sm:hidden">
                      Show {comment.repliesCount}
                    </span>
                  </>
                )}
                {comment.repliesCount > 0 && (
                  <span className="hidden sm:inline-block">
                    ({comment.repliesCount})
                  </span>
                )}
              </button>
            )}

            <div className="relative ml-auto" ref={menuRef}>
              <button
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                onClick={toggleMenu}
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 w-32 z-10 animate-fadeIn">
                  {isAuthor ? (
                    <>
                      <button
                        className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-indigo-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={startEditing}
                      >
                        <Pencil className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                        onClick={handleDeleteComment}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </>
                  ) : (
                    <button className="flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                      <Flag className="w-4 h-4" />
                      <span>Report</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Reply input */}
          {isReplying && (
            <div className="ml-0 sm:ml-2 mt-2">
              <CommentInput
                postId={postId}
                authorName={authorName}
                onCommentAdded={handleReplyAdded}
                placeholder={`Reply to ${comment.authorId.name}...`}
                isReply={true}
                parentId={comment._id}
                autoFocus={true}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested replies */}
      {comment.isExpanded && comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-4 animate-slideDown">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              level={level + 1}
              currentUserId={currentUserId}
              authorName={authorName}
              postId={postId}
              onNewReply={onNewReply}
              updateComments={updateComments}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
