import { LikeResponseDTO } from "../../../mapping/user/post/likemapper";

export interface ILikeService {
  likeOrUnlikePost(postId: string, userId: string): Promise<{ liked: boolean }>;
  getLikesForPost(postId: string): Promise<LikeResponseDTO[]>;
}
