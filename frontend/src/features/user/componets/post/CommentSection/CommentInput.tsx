import React, { useState } from "react";
import { Send } from "lucide-react";
import Avatar from "../../ui/Avatar";
import { AddComment } from "../../../services/PostService";

interface CommentInputProps {
  postId: string;
  authorName: string;
  onCommentAdded: (newComment: any) => void;
  placeholder?: string;
  isReply?: boolean;
  parentId?: string | null;
  autoFocus?: boolean;
  onCancel?: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
  postId,
  authorName,
  onCommentAdded,
  placeholder = "Add a comment...",
  isReply = false,
  parentId = null,
  autoFocus = false,
  onCancel,
}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newCommentData = await AddComment(
        postId,
        content,
        parentId,
        authorName
      );
      onCommentAdded(newCommentData);
      setContent("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative ${isReply ? "mt-3 mb-2" : "mb-6"}`}
    >
      <div className={`flex gap-2 ${isReply ? "" : "items-center"}`}>
        {!isReply && <Avatar size="sm" alt="Your profile" />}
        <div className="flex-1 relative">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={`w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
              ${isReply ? "rounded-xl py-2 px-3" : "rounded-full py-2.5 px-4"} 
              text-gray-800 dark:text-gray-200 text-sm focus:outline-none 
              focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-all`}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
            {isReply && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded-full mr-1 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className={`${
                isReply ? "p-1.5" : "p-2"
              } rounded-full transition-all
                ${
                  !content.trim() || isSubmitting
                    ? "bg-indigo-400 opacity-50 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-md hover:shadow-indigo-500/20"
                } 
                text-white`}
            >
              <Send
                size={isReply ? 14 : 16}
                className={isSubmitting ? "animate-pulse" : ""}
              />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentInput;
