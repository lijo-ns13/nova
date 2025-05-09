// src/infrastructure/database/repositories/comment.repository.ts
import { injectable } from "inversify";
import { Types } from "mongoose";
import commentModal, { IComment } from "../../models/comment.modal";
import { ICommentRepository } from "../../interfaces/repositories/ICommentRepository";

@injectable()
export class CommentRepository implements ICommentRepository {
  async create(comment: Partial<IComment>): Promise<IComment> {
    const newComment = await commentModal.create(comment);
    // return newComment;
    const populatedComment = await newComment.populate(
      "authorId",
      "name profilePicture"
    );
    return populatedComment;
  }

  async findById(commentId: string): Promise<IComment | null> {
    return commentModal.findById(commentId).exec();
  }

  async findByPostId(
    postId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IComment[]> {
    const skip = (page - 1) * limit;
    return commentModal
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
    return commentModal
      .find({ parentId: new Types.ObjectId(parentId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async update(
    commentId: string,
    updates: Partial<IComment>
  ): Promise<IComment | null> {
    return commentModal
      .findByIdAndUpdate(commentId, updates, { new: true })
      .exec();
  }

  async delete(commentId: string): Promise<boolean> {
    const result = await commentModal.deleteOne({ _id: commentId }).exec();
    return result.deletedCount > 0;
  }

  async addLike(commentId: string, userId: string): Promise<IComment | null> {
    return commentModal
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
    return commentModal
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
    const comment = await commentModal.findOne({
      _id: commentId,
      "likes.userId": new Types.ObjectId(userId),
    });

    return !!comment;
  }

  async countByPostId(postId: string): Promise<number> {
    return commentModal
      .countDocuments({ postId: new Types.ObjectId(postId) })
      .exec();
  }
}
