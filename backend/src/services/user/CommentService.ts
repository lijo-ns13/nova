import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { ICommentRepository } from "../../interfaces/repositories/ICommentRepository";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { CommentMapper } from "../../mapping/user/post/commentmapper";
import {
  CommentResponseDTO,
  CreateCommentDTO,
  UpdateCommentDTO,
} from "../../core/dtos/user/post/comment.dto";
import { ICommentService } from "../../interfaces/services/Post/ICommentService";

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
