import {
  CommentResponseDTO,
  CreateCommentDTO,
  UpdateCommentDTO,
} from "../../../core/dtos/user/post/comment.dto";

export interface ICommentService {
  createComment(input: CreateCommentDTO): Promise<CommentResponseDTO>;
  updateComment(input: UpdateCommentDTO): Promise<CommentResponseDTO>;
  deleteComment(commentId: string, userId: string): Promise<void>;
  getCommentsByPostId(
    postId: string,
    page: number,
    limit: number
  ): Promise<CommentResponseDTO[]>;
}
