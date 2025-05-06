export interface CommentAuthor {
  _id: string;
  name: string;
  profilePicture: string;
  username: string;
}

export interface Comment {
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
