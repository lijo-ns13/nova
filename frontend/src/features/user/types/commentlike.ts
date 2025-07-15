export interface LikeResponseDTO {
  _id: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    profilePicture: string | null;
  };
}
export interface CreateCommentInput {
  postId: string;
  content: string;
  parentId?: string;
  authorName: string;
}
export interface CommentResponseDTO {
  id: string;
  postId: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  content: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}
