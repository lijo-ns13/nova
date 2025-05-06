import React from "react";
import CommentItem from "./CommentItem";
import Button from "../../ui/Button";
import type { Comment } from "../../../../../types/comment";

interface CommentListProps {
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  currentUserId: string;
  authorName: string;
  postId: string;
  onNewReply: (parentId: string, replyData: any) => void;
  loadMoreComments: () => Promise<void>;
  isLoadingMore: boolean;
  hasMoreComments: boolean;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  setComments,
  currentUserId,
  authorName,
  postId,
  onNewReply,
  loadMoreComments,
  isLoadingMore,
  hasMoreComments,
}) => {
  // Function to update comments state
  const updateComments = (transformer: (comments: Comment[]) => Comment[]) => {
    setComments((prev) => transformer(prev));
  };

  return (
    <div>
      <div className="space-y-5">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            currentUserId={currentUserId}
            authorName={authorName}
            postId={postId}
            onNewReply={onNewReply}
            updateComments={updateComments}
          />
        ))}
      </div>

      {hasMoreComments && (
        <div className="text-center pt-4">
          <Button
            variant="ghost"
            onClick={loadMoreComments}
            isLoading={isLoadingMore}
            className="text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 
            font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-4 py-2 rounded-full 
            transition-all transform hover:scale-105 focus:ring-2 focus:ring-indigo-500/30"
          >
            {isLoadingMore ? "Loading..." : "Load more comments"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentList;
