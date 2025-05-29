import { injectable, inject } from "inversify";
import { ILikeService } from "../../interfaces/services/Post/ILikeService";
import { ILikeRepository } from "../../interfaces/repositories/ILikeRepository";
import { TYPES } from "../../di/types";
import { Types } from "mongoose";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { IPostRepository } from "../../interfaces/repositories/IPostRepository";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";

@injectable()
export class LikeService implements ILikeService {
  constructor(
    @inject(TYPES.LikeRepository) private _likeRepo: ILikeRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService,
    @inject(TYPES.PostRepository) private _postRepo: IPostRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}

  async likeOrUnlikePost(
    postId: string,
    userId: string
  ): Promise<{ liked: boolean }> {
    const existingLike = await this._likeRepo.findByPostIdAndUserId(
      postId,
      userId
    );

    if (existingLike) {
      await this._likeRepo.deleteByPostIdAndUserId(postId, userId);
      return { liked: false }; // unliked
    } else {
      const like = await this._likeRepo.create({
        postId: new Types.ObjectId(postId),
        userId: new Types.ObjectId(userId),
      });
      const getPost = await this._postRepo.getPost(postId);
      const userData = await this._userRepo.findById(userId);
      console.log("userData", userData);
      console.log("getPostssssssssssssss", getPost);
      if (getPost?.creatorId?._id) {
        await this.notificationService.sendNotification(
          getPost.creatorId._id.toString(),
          `${userData?.name} liked your post`
        );
      }

      return { liked: true }; // liked
    }
  }

  async getLikesForPost(postId: string) {
    return this._likeRepo.findLikesByPostId(postId);
  }
}
