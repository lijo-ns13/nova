import { IPost } from "../repositories/entities/post.entity";
import { IPostServiceResponse, IUserProfileDTO } from "../core/entities/post";
import { IMediaService } from "../interfaces/services/Post/IMediaService";
import { IMedia } from "../repositories/entities/media.entity";
import { Types } from "mongoose";
import { IUser } from "../repositories/entities/user.entity";

type MediaRef = IMedia | Types.ObjectId;

export class ProfileViewMapper {
  static async toServiceResponse(
    post: IPost & { mediaIds: MediaRef[] },
    mediaService: IMediaService
  ): Promise<IPostServiceResponse> {
    const mediaUrls = await Promise.all(
      post.mediaIds.map(
        async (
          mediaRef: MediaRef
        ): Promise<{ mediaUrl: string; mimeType: string }> => {
          if (mediaRef instanceof Types.ObjectId) {
            return { mediaUrl: "", mimeType: "image/jpeg" };
          }
          const s3Key = mediaRef.s3Key;
          const mimeType = mediaRef.mimeType;
          const mediaUrl = await mediaService.getMediaUrl(s3Key);

          return { mediaUrl, mimeType };
        }
      )
    );

    return {
      _id: post._id,
      creatorId: post.creatorId,
      description: post.description,
      mediaUrls,
      createdAt: post.createdAt.toISOString(),
      Likes: post.Likes ?? null,
    };
  }

  static async toServiceResponseList(
    posts: (IPost & { mediaIds: MediaRef[] })[],
    mediaService: IMediaService
  ): Promise<IPostServiceResponse[]> {
    return Promise.all(
      posts.map((post) => this.toServiceResponse(post, mediaService))
    );
  }
  static async toProfileDTO(
    user: IUser,
    mediaService: IMediaService
  ): Promise<IUserProfileDTO> {
    let profilePictureUrl: string | undefined = undefined;
    if (user.profilePicture) {
      profilePictureUrl = await mediaService.getMediaUrl(user.profilePicture);
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      profilePicture: profilePictureUrl,
      headline: user.headline,
      about: user.about,
      skills: Array.isArray(user.skills) ? user.skills : [],
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      followersCount: Array.isArray(user.followers) ? user.followers.length : 0,
      followingCount: Array.isArray(user.following) ? user.following.length : 0,
      appliedJobCount: user.appliedJobCount,
      createdPostCount: user.createdPostCount,
      subscriptionActive: user.isSubscriptionActive,
    };
  }
}
