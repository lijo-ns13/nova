import { ILike } from "../../models/like.modal";
import { IBaseRepository } from "./IBaseRepository";

export interface ILikeRepository extends IBaseRepository<ILike> {
  // Find a like by postId and userId
  findByPostIdAndUserId(postId: string, userId: string): Promise<ILike | null>;

  // Delete a like by postId and userId (for unliking a post)
  deleteByPostIdAndUserId(postId: string, userId: string): Promise<boolean>;

  // Find all likes for a given postId
  findLikesByPostId(postId: string): Promise<ILike[]>;
}
