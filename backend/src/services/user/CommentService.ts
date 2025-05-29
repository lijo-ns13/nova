// src/core/services/Comment/CommentService.ts
import { injectable, inject } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../di/types";
import {
  ICommentService,
  ICommentServiceResponse,
  ICommentServiceResponsePaginated,
} from "../../interfaces/services/ICommentService";
import { ICommentRepository } from "../../interfaces/repositories/ICommentRepository";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { IPost } from "../../models/post.modal";

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject(TYPES.CommentRepository) private _commentRepo: ICommentRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService
  ) {}

  private mapCommentToResponse(comment: any): ICommentServiceResponse {
    return {
      _id: comment._id,
      postId: comment.postId,
      parentId: comment.parentId,
      authorId: comment.authorId,
      authorName: comment.authorName,
      content: comment.content,
      path: comment.path,
      likes: comment.likes,
      likeCount: comment.likeCount,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      repliesCount: comment.repliesCount,
    };
  }

  async createComment(
    postId: string,
    authorId: string,
    authorName: string,
    content: string,
    parentId?: string
  ): Promise<ICommentServiceResponse> {
    try {
      const path = parentId ? [new Types.ObjectId(parentId)] : [];

      const comment = await this._commentRepo.create({
        postId: new Types.ObjectId(postId),
        parentId: parentId ? new Types.ObjectId(parentId) : null,
        authorId: new Types.ObjectId(authorId),
        authorName,
        content,
        path,
      });
      console.log("commentssssssssssssssssss", comment);
      // this for send notfiication
      await this.notificationService.sendNotification(
        (comment.postId as IPost)?.creatorId.toString(),
        `${authorName} commented your post`
      );
      return this.mapCommentToResponse(comment);
    } catch (error) {
      throw new Error(`Failed to create comment: ${(error as Error).message}`);
    }
  }

  async getComment(commentId: string): Promise<ICommentServiceResponse> {
    try {
      const comment = await this._commentRepo.findById(commentId);
      if (!comment) throw new Error("Comment not found");

      // Get replies count for this comment
      const repliesCount = await this._commentRepo.countByPostId(commentId);

      const response = this.mapCommentToResponse(comment);
      response.repliesCount = repliesCount;

      return response;
    } catch (error) {
      throw new Error(`Failed to get comment: ${(error as Error).message}`);
    }
  }

  async getCommentsByPostId(
    postId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ICommentServiceResponsePaginated> {
    try {
      const [comments, totalComments] = await Promise.all([
        this._commentRepo.findByPostId(postId, page, limit),
        this._commentRepo.countByPostId(postId),
      ]);

      // Get replies count for each comment
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const repliesCount = await this._commentRepo.countByPostId(
            comment._id.toString()
          );
          const response = this.mapCommentToResponse(comment);
          response.repliesCount = repliesCount;
          return response;
        })
      );

      return {
        comments: commentsWithReplies,
        totalComments,
        totalPages: Math.ceil(totalComments / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new Error(`Failed to get comments: ${(error as Error).message}`);
    }
  }

  async getRepliesByCommentId(
    commentId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ICommentServiceResponsePaginated> {
    try {
      const [replies, totalReplies] = await Promise.all([
        this._commentRepo.findByParentId(commentId, page, limit),
        this._commentRepo.countByPostId(commentId),
      ]);

      const repliesWithCounts = await Promise.all(
        replies.map(async (reply) => {
          const repliesCount = await this._commentRepo.countByPostId(
            reply._id.toString()
          );
          const response = this.mapCommentToResponse(reply);
          response.repliesCount = repliesCount;
          return response;
        })
      );

      return {
        comments: repliesWithCounts,
        totalComments: totalReplies,
        totalPages: Math.ceil(totalReplies / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new Error(`Failed to get replies: ${(error as Error).message}`);
    }
  }

  async updateComment(
    commentId: string,
    content: string,
    authorId: string
  ): Promise<ICommentServiceResponse> {
    try {
      const comment = await this._commentRepo.findById(commentId);
      if (!comment) throw new Error("Comment not found");
      console.log(comment, authorId, "lkdsjfkl");
      if (comment.authorId.toString() !== authorId) {
        throw new Error("Unauthorized: You can only update your own comments");
      }

      const updatedComment = await this._commentRepo.update(commentId, {
        content,
      });
      if (!updatedComment) throw new Error("Failed to update comment");

      return this.mapCommentToResponse(updatedComment);
    } catch (error) {
      throw new Error(`Failed to update comment: ${(error as Error).message}`);
    }
  }

  async deleteComment(commentId: string, authorId: string): Promise<boolean> {
    try {
      const comment = await this._commentRepo.findById(commentId);
      if (!comment) throw new Error("Comment not found");

      if (comment.authorId.toString() !== authorId) {
        throw new Error("Unauthorized: You can only delete your own comments");
      }

      const result = await this._commentRepo.delete(commentId);
      return result;
    } catch (error) {
      throw new Error(`Failed to delete comment: ${(error as Error).message}`);
    }
  }

  async toggleLikeComment(
    commentId: string,
    userId: string
  ): Promise<ICommentServiceResponse> {
    try {
      const hasLiked = await this._commentRepo.hasUserLiked(commentId, userId);

      const updatedComment = hasLiked
        ? await this._commentRepo.removeLike(commentId, userId)
        : await this._commentRepo.addLike(commentId, userId);

      if (!updatedComment) throw new Error("Comment not found");

      return this.mapCommentToResponse(updatedComment);
    } catch (error) {
      throw new Error(
        `Failed to toggle comment like: ${(error as Error).message}`
      );
    }
  }
}
