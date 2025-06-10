import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";
import { BaseRepository } from "./BaseRepository"; // wherever your base repo lives
import commentModal, { IComment } from "../../models/comment.modal";
import { ICommentRepository } from "../../interfaces/repositories/ICommentRepository";
import { TYPES } from "../../di/types";

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

  // Override if you need to customize
  async create(comment: Partial<IComment>): Promise<IComment> {
    const newComment = await this.model.create(comment);
    return await (
      await newComment.populate("authorId", "name profilePicture")
    ).populate("postId");
  }

  async findByPostId(
    postId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IComment[]> {
    const skip = (page - 1) * limit;
    return this.model
      .find({ postId: new Types.ObjectId(postId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("authorId", "name profilePicture username")
      .exec();
  }

  async findByParentId(
    parentId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IComment[]> {
    const skip = (page - 1) * limit;
    return this.model
      .find({ parentId: new Types.ObjectId(parentId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async addLike(commentId: string, userId: string): Promise<IComment | null> {
    return this.model
      .findByIdAndUpdate(
        commentId,
        {
          $addToSet: { likes: { userId: new Types.ObjectId(userId) } },
          $inc: { likeCount: 1 },
        },
        { new: true }
      )
      .exec();
  }

  async removeLike(
    commentId: string,
    userId: string
  ): Promise<IComment | null> {
    return this.model
      .findByIdAndUpdate(
        commentId,
        {
          $pull: { likes: { userId: new Types.ObjectId(userId) } },
          $inc: { likeCount: -1 },
        },
        { new: true }
      )
      .exec();
  }

  async hasUserLiked(commentId: string, userId: string): Promise<boolean> {
    const comment = await this.model.findOne({
      _id: commentId,
      "likes.userId": new Types.ObjectId(userId),
    });
    return !!comment;
  }

  async countByPostId(postId: string): Promise<number> {
    return this.model
      .countDocuments({ postId: new Types.ObjectId(postId) })
      .exec();
  }
}
