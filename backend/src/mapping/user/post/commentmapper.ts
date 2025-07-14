import { CommentResponseDTO } from "../../../core/dtos/user/post/comment.dto";
import { IComment } from "../../../models/comment.modal";

export class CommentMapper {
  static toDTO(comment: IComment): CommentResponseDTO {
    return {
      id: comment._id.toString(),
      postId: comment.postId.toString(),
      parentId: comment.parentId?.toString() || null,
      authorId: comment.authorId.toString(),
      authorName: comment.authorName,
      content: comment.content,
      likeCount: comment.likeCount,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    };
  }
}
