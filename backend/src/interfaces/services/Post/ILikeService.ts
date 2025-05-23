import { ILike } from "../../../models/like.modal";

export interface ILikeService {
  likeOrUnlikePost(postId: string, userId: string): Promise<{ liked: boolean }>;
  getLikesForPost(postId: string): Promise<ILike[]>;
}
