import {
  CreateCommentDTO,
  UpdateCommentDTO,
} from "../../core/dtos/user/post/comment.dto";
import { IComment } from "../../models/comment.modal";

export interface ICommentRepository {
  createComment(input: CreateCommentDTO): Promise<IComment>;
  updateComment(input: UpdateCommentDTO): Promise<IComment>;
  softDeleteComment(commentId: string, userId: string): Promise<void>;
  getCommentsByPostId(
    postId: string,
    page: number,
    limit: number
  ): Promise<IComment[]>;
}
