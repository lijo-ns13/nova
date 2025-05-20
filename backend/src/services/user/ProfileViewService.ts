import { injectable, inject } from "inversify";

import { TYPES } from "../../di/types";
import { Types } from "mongoose";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IProfileViewService } from "../../interfaces/services/IProfileViewService";
import { IUser } from "../../models/user.modal";
import { IPostRepository } from "../../interfaces/repositories/IPostRepository";
import { HTTP_STATUS_CODES } from "../../core/enums/httpStatusCode";
import { IPostServiceResponse } from "../../core/entities/post";
import { IPost } from "../../models/post.modal";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";

@injectable()
export class ProfileViewService implements IProfileViewService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.PostRepository) private _postRepository: IPostRepository,
    @inject(TYPES.MediaService) private _mediaService: IMediaService
  ) {}
  async getUserBasicData(username: string): Promise<IUser> {
    try {
      const userData = await this._userRepository.findOne({ username }, [
        { path: "certifications" },
        { path: "experiences" },
        { path: "projects" },
        { path: "educations" },
      ]);
      if (!userData) {
        throw new Error("Users data not found");
      }
      return userData;
    } catch (error) {
      console.log("error occured in profileviewservice", error);
      throw new Error((error as Error).message || "error occured");
    }
  }
  async getUserPostData(
    page: number,
    limit: number,
    username: string
  ): Promise<any> {
    try {
      const user = await this._userRepository.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      const userId = user._id;
      console.log("userId", userId, "jldsk");
      if (!userId) {
        throw new Error("User id not found");
      }
      const posts: IPost[] = await this._postRepository.findByCreator(
        page,
        limit,
        userId.toString()
      );
      // Map media URLs
      const postsWithMediaUrls: IPostServiceResponse[] = await Promise.all(
        posts.map(async (post: any) => {
          const mediaUrls = await Promise.all(
            post.mediaIds.map(async (media: any) => {
              const mediaUrl = await this._mediaService.getMediaUrl(
                media.s3Key
              );
              return {
                mediaUrl: mediaUrl,
                mimeType: media.mimeType,
              };
            })
          );

          return {
            _id: post._id,
            creatorId: post.creatorId,
            description: post.description,
            mediaUrls: mediaUrls,
            createdAt: new Date(post.createdAt).toISOString(),
            Likes: post.Likes,
          };
        })
      );

      // Return paginated posts with total count
      return {
        posts: postsWithMediaUrls,
        currentPage: page,
      };
    } catch (error) {
      console.log("errors", error);
      throw new Error((error as Error).message);
    }
  }
}
