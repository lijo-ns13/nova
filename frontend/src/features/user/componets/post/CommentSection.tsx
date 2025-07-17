import React, { useEffect, useState } from "react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { Send, Edit, Trash2, Reply, Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  createComment,
  deleteComment,
  getPostComments,
  updateComment,
} from "../../services/PostService";
import {
  CommentResponseDTO,
  CreateCommentInput,
} from "../../types/commentlike";

interface Props {
  postId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
}

const CommentSection: React.FC<Props> = ({
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
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    setLoading(true);
    try {
      const fetched = await getPostComments(postId);
      setComments(fetched);
    } catch (e) {
      console.error("Failed to load comments", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const nestComments = (list: CommentResponseDTO[]) => {
    const map = new Map<string, any>();
    const roots: any[] = [];

    list.forEach((c) => map.set(c.id, { ...c, children: [] }));
    list.forEach((c) => {
      if (c.parentId) {
        const parent = map.get(c.parentId);
        if (parent) parent.children.push(map.get(c.id));
      } else {
        roots.push(map.get(c.id));
      }
    });

    return roots;
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await createComment({
        postId,
        content: newComment,
        authorName: currentUserName,
      });
      await loadComments();
      setNewComment("");
    } catch (e) {
      console.error("Failed to add comment", e);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim()) return;
    try {
      await createComment({
        postId,
        content: replyContent,
        parentId,
        authorName: currentUserName,
      });
      await loadComments();
      setReplyingTo(null);
      setReplyContent("");
    } catch (e) {
      console.error("Failed to add reply", e);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    try {
      await updateComment(commentId, editContent);
      await loadComments();
      setEditingCommentId(null);
      setEditContent("");
    } catch (e) {
      console.error("Failed to update comment", e);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      await loadComments();
    } catch (e) {
      console.error("Failed to delete comment", e);
    }
  };

  const renderComments = (commentList: any[], depth = 0) =>
    commentList.map((comment) => (
      <div key={comment.id} className={`ml-${depth * 4} mt-4`}>
        <div className="flex items-start gap-2">
          <Avatar src={currentUserAvatar} alt={comment.authorName} />
          <div className="bg-gray-100 rounded-lg px-3 py-2 w-full">
            <div className="text-sm font-semibold">{comment.authorName}</div>
            <div className="text-xs text-gray-600">
              {formatDistanceToNow(new Date(comment.createdAt))} ago
            </div>
            {editingCommentId === comment.id ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border p-1 mt-2"
                />
                <div className="flex gap-2 mt-1">
                  <Button
                    onClick={() => handleUpdateComment(comment.id)}
                    size="sm"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditContent("");
                    }}
                    variant="secondary"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-1">{comment.content}</div>
            )}
            <div className="flex gap-3 text-xs text-gray-500 mt-2">
              <button
                onClick={() => setReplyingTo(comment.id)}
                className="flex items-center gap-1"
              >
                <Reply size={12} />
                Reply
              </button>
              {comment.authorId === currentUserId && (
                <>
                  <button
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditContent(comment.content);
                    }}
                    className="flex items-center gap-1"
                  >
                    <Edit size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex items-center gap-1 text-red-600"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </>
              )}
            </div>
            {replyingTo === comment.id && (
              <div className="mt-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full border p-1"
                />
                <div className="flex gap-2 mt-1">
                  <Button onClick={() => handleAddReply(comment.id)} size="sm">
                    Reply
                  </Button>
                  <Button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                    }}
                    size="sm"
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {comment.children?.length > 0 &&
          renderComments(comment.children, depth + 1)}
      </div>
    ));

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <Avatar src={currentUserAvatar} alt={currentUserName} />
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full border p-2 rounded-md"
        />
        <Button onClick={handleAddComment} disabled={!newComment.trim()}>
          <Send size={16} />
        </Button>
      </div>
      {loading ? (
        <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center gap-1">
          <Loader className="animate-spin" size={16} />
          Loading comments...
        </div>
      ) : (
        <div className="mt-4">{renderComments(nestComments(comments))}</div>
      )}
    </div>
  );
};

export default CommentSection;
