import { injectable, inject } from "inversify";
import { ILikeService } from "../../interfaces/services/Post/ILikeService";
import { ILikeRepository } from "../../interfaces/repositories/ILikeRepository";
import { TYPES } from "../../di/types";
import { Types } from "mongoose";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { IPostRepository } from "../../interfaces/repositories/IPostRepository";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { NotificationType } from "../../models/notification.modal";
import {
  LikeMapper,
  LikeResponseDTO,
} from "../../mapping/user/post/likemapper";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { AppEventEmitter } from "../../event/AppEventEmitter";
@injectable()
export class LikeService implements ILikeService {
  constructor(
    @inject(TYPES.LikeRepository) private _likeRepo: ILikeRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService,
    @inject(TYPES.PostRepository) private _postRepo: IPostRepository,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.MediaService) private _mediaService: IMediaService
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
      AppEventEmitter.emit("post:like", { postId, userId, liked: false });
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
      if (
        getPost?.creatorId?._id &&
        getPost?.creatorId._id.toString() != userId.toString()
      ) {
        await this.notificationService.sendNotification(
          getPost.creatorId._id.toString(),
          `${userData?.name} liked your post`,
          NotificationType.LIKE,
          userId
        );
      }
      AppEventEmitter.emit("post:like", { postId, userId, liked: true });
      return { liked: true }; // liked
    }
  }

  async getLikesForPost(postId: string): Promise<LikeResponseDTO[]> {
    const likes = await this._likeRepo.findLikesByPostId(postId);

    return Promise.all(
      likes.map(async (like) => {
        let profilePictureUrl: string | null = null;

        if (like.userId.profilePicture) {
          profilePictureUrl = await this._mediaService.getMediaUrl(
            like.userId.profilePicture
          );
        }

        return LikeMapper.toDTO(like, profilePictureUrl);
      })
    );
  }
}
