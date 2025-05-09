// src/core/interfaces/repositories/ICommentRepository.ts
import { Types } from "mongoose";
import { IComment } from "../../models/comment.modal";

export interface ICommentRepository {
  create(comment: Partial<IComment>): Promise<IComment>;
  findById(commentId: string): Promise<IComment | null>;
  findByPostId(
    postId: string,
    page?: number,
    limit?: number
  ): Promise<IComment[]>;
  findByParentId(
    parentId: string,
    page?: number,
    limit?: number
  ): Promise<IComment[]>;
  update(
    commentId: string,
    updates: Partial<IComment>
  ): Promise<IComment | null>;
  delete(commentId: string): Promise<boolean>;
  addLike(commentId: string, userId: string): Promise<IComment | null>;
  removeLike(commentId: string, userId: string): Promise<IComment | null>;
  countByPostId(postId: string): Promise<number>;
  hasUserLiked(commentId: string, userId: string): Promise<boolean>;
}
