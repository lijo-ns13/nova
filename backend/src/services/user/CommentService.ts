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
import { NotificationType } from "../../models/notification.modal";
import { CommentMapper } from "../../mapping/user/post/commentmapper";
import {
  CommentResponseDTO,
  CreateCommentDTO,
  UpdateCommentDTO,
} from "../../core/dtos/user/post/comment.dto";

@injectable()
export class CommentService implements ICommentService {
  constructor(
    @inject(TYPES.CommentRepository) private _commentRepo: ICommentRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService
  ) {}
  async createComment(input: CreateCommentDTO): Promise<CommentResponseDTO> {
    const comment = await this._commentRepo.createComment(input);
    return CommentMapper.toDTO(comment);
  }

  async updateComment(input: UpdateCommentDTO): Promise<CommentResponseDTO> {
    const comment = await this._commentRepo.updateComment(input);
    return CommentMapper.toDTO(comment);
  }

  async deleteComment(commentId: string, userId: string): Promise<void> {
    await this._commentRepo.softDeleteComment(commentId, userId);
  }

  async getCommentsByPostId(
    postId: string,
    page: number,
    limit: number
  ): Promise<CommentResponseDTO[]> {
    const comments = await this._commentRepo.getCommentsByPostId(
      postId,
      page,
      limit
    );
    return comments.map(CommentMapper.toDTO);
  }
}
