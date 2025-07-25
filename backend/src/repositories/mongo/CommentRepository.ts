import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";
import { BaseRepository } from "./BaseRepository"; // wherever your base repo lives
import commentModal, { IComment } from "../../models/comment.modal";
import { ICommentRepository } from "../../interfaces/repositories/ICommentRepository";
import { TYPES } from "../../di/types";
import {
  CreateCommentDTO,
  UpdateCommentDTO,
} from "../../core/dtos/user/post/comment.dto";

@injectable()
export class CommentRepository
  extends BaseRepository<IComment>
  implements ICommentRepository
{
  constructor(
    @inject(TYPES.commentModal) private readonly commentModel: Model<IComment>
  ) {
    super(commentModal);
  }

  async createComment(input: CreateCommentDTO): Promise<IComment> {
    const { postId, content, parentId, authorId, authorName } = input;

    const path = parentId
      ? [
          ...(await commentModal
            .findById(parentId)
            ?.then((c) => c?.path || [])),
          new Types.ObjectId(parentId),
        ]
      : [];

    return commentModal.create({
      postId: new Types.ObjectId(postId),
      content,
      parentId: parentId ? new Types.ObjectId(parentId) : null,
      authorId: new Types.ObjectId(authorId),
      authorName,
      path,
    });
  }

  async updateComment({
    commentId,
    content,
    userId,
  }: UpdateCommentDTO): Promise<IComment> {
    const comment = await commentModal.findOneAndUpdate(
      {
        _id: new Types.ObjectId(commentId),
        authorId: new Types.ObjectId(userId),
      },
      { content },
      { new: true }
    );

    if (!comment) throw new Error("Unauthorized or comment not found");

    return comment;
  }

  async softDeleteComment(commentId: string, userId: string): Promise<void> {
    const result = await commentModal.deleteOne({
      _id: new Types.ObjectId(commentId),
      authorId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0)
      throw new Error("Unauthorized or comment not found");
  }

  async getCommentsByPostId(
    postId: string,
    page: number,
    limit: number
  ): Promise<IComment[]> {
    return commentModal
      .find({ postId: new Types.ObjectId(postId) })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }
}
