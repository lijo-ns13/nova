// src/core/interfaces/services/Comment/ICommentService.ts
import { Types } from "mongoose";

export interface ICommentServiceResponse {
  _id: Types.ObjectId;
  postId: Types.ObjectId;
  parentId: Types.ObjectId | null;
  authorId: Types.ObjectId;
  authorName: string;
  content: string;
  path: Types.ObjectId[];
  likes: { userId: Types.ObjectId; createdAt: Date }[];
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  repliesCount?: number;
}

export interface ICommentServiceResponsePaginated {
  comments: ICommentServiceResponse[];
  totalComments: number;
  totalPages: number;
  currentPage: number;
}

export interface ICommentService {
  createComment(
    postId: string,
    authorId: string,
    authorName: string,
    content: string,
    parentId?: string
  ): Promise<ICommentServiceResponse>;
  getComment(commentId: string): Promise<ICommentServiceResponse>;
  getCommentsByPostId(
    postId: string,
    page?: number,
    limit?: number
  ): Promise<ICommentServiceResponsePaginated>;
  getRepliesByCommentId(
    commentId: string,
    page?: number,
    limit?: number
  ): Promise<ICommentServiceResponsePaginated>;
  updateComment(
    commentId: string,
    content: string,
    authorId: string
  ): Promise<ICommentServiceResponse>;
  deleteComment(commentId: string, authorId: string): Promise<boolean>;
  likeComment(
    commentId: string,
    userId: string
  ): Promise<ICommentServiceResponse>;
  unlikeComment(
    commentId: string,
    userId: string
  ): Promise<ICommentServiceResponse>;
}
