// src/dtos/comment/CommentDTO.ts
export interface CreateCommentDTO {
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  parentId?: string;
}

export interface UpdateCommentDTO {
  commentId: string;
  content: string;
  userId: string;
}

export interface CommentResponseDTO {
  id: string;
  postId: string;
  parentId?: string | null;
  authorId: string;
  authorName: string;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}
