import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { MessageSquare } from "lucide-react";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";
import LoadingComments from "./LoadingComments";
import EmptyCommentState from "./EmptyCommentState";
import { fetchComments } from "../../../services/PostService";
import type { Comment } from "../../../../../types/comment";

interface CommentSectionProps {
  postId: string;
  currentUserId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  currentUserId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { name: authorName } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        const res = await fetchComments(postId, 1);
        const processedComments = processCommentsHierarchy(res.comments);

        setComments(processedComments);
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

  // Handle setting a new comment
  const handleNewComment = (newCommentData: any) => {
    const enhancedComment = {
      ...newCommentData,
      replies: [],
      isExpanded: true,
    };
    setComments((prev) => [enhancedComment, ...prev]);
  };

  // Handle setting a new reply
  const handleNewReply = (parentId: string, replyData: any) => {
    const newReply = {
      ...replyData,
      replies: [],
      isExpanded: true,
    };

    setComments((prev) => updateCommentsWithNewReply(prev, parentId, newReply));
  };

  return (
    <div className="px-4 py-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-indigo-500" />
        <span>Comments</span>
      </h3>

      <CommentInput
        postId={postId}
        authorName={authorName}
        onCommentAdded={handleNewComment}
      />

      <div className="mt-8 space-y-6">
        {isLoading ? (
          <LoadingComments />
        ) : comments.length === 0 ? (
          <EmptyCommentState />
        ) : (
          <CommentList
            comments={comments}
            setComments={setComments}
            currentUserId={currentUserId}
            authorName={authorName}
            postId={postId}
            onNewReply={handleNewReply}
            loadMoreComments={loadMoreComments}
            isLoadingMore={isLoadingMore}
            hasMoreComments={currentPage < totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default CommentSection;
