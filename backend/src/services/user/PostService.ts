import { injectable, inject } from "inversify";
import { IPostRepository } from "../../interfaces/repositories/IPostRepository";
import { Types } from "mongoose";
import { TYPES } from "../../di/types";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import postModal, { IPost } from "../../models/post.modal";
import { IMedia } from "../../models/media.modal";
import {
  IPostServiceResponse,
  IPostServiceResponsePaginated,
} from "../../core/entities/post";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";

@injectable()
export class PostService {
  constructor(
    @inject(TYPES.PostRepository) private _postRepo: IPostRepository,
    @inject(TYPES.MediaService) private _mediaService: IMediaService,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}

  async createPost(
    creatorId: string,
    description: string,
    mediaFiles: Express.Multer.File[]
  ): Promise<IPost> {
    let mediaIds: string[] = [];

    try {
      const user = await this._userRepo.findById(creatorId);
      console.log("usercreator", user);
      if (!user) {
        throw new Error("User not found");
      }
      const maxFreePostCreateCount = parseInt(
        process.env.FREE_POST_CREATION_COUNT ?? "5",
        10
      );
      const hasValidSubscription =
        user.isSubscriptionTaken &&
        user.subscriptionExpiresAt &&
        user.subscriptionExpiresAt > new Date();
      console.log("hasValidSubscription", hasValidSubscription);
      if (
        !hasValidSubscription &&
        user.createdPostCount >= maxFreePostCreateCount
      ) {
        throw new Error(
          "Please take a subscription. Your free access has ended."
        );
      }
      mediaIds = await this._mediaService.uploadMedia(
        mediaFiles,
        creatorId,
        "User"
      );
      console.log("mediaIds", mediaIds);
      if (!mediaIds)
        throw new Error("media uploading failed,check media service");
      const post = await this._postRepo.create({
        creatorId: new Types.ObjectId(creatorId),
        description,
        mediaIds: mediaIds.map((id) => new Types.ObjectId(id)),
      });
      await this._userRepo.updateUser(creatorId, {
        createdPostCount: user.createdPostCount + 1,
      });
      return post;
    } catch (error) {
      // Cleanup uploaded media if post creation fails
      if (mediaIds.length > 0) {
        await this._mediaService.deleteMedia(mediaIds).catch(console.error);
      }
      throw new Error(`Post creation failed:${(error as Error).message} `);
    }
  }
  // Get a single post by its ID, including media URLs
  async getPost(postId: string): Promise<IPostServiceResponse> {
    try {
      // Fetch post by ID, populating mediaIds and userId fields
      const post = await this._postRepo.getPost(postId);
      if (!post) throw new Error("Post not found");
      console.log("post in postservice", post);
      // Map media IDs to signed URLs
      const mediaUrls = await Promise.all(
        post.mediaIds.map(async (media: any) => {
          const mediaUrl = await this._mediaService.getMediaUrl(media.s3Key);
          return {
            mediaUrl: mediaUrl,
            mimeType: media.mimeType,
          };
        })
      );
      const postData: IPostServiceResponse = {
        _id: postId,
        creatorId: post.creatorId,
        description: post.description,
        mediaUrls: mediaUrls,
        createdAt: new Date(post.createdAt).toISOString(),
        Likes: post.Likes,
      };
      // Include media URLs and user data in the post data

      return { ...postData };
    } catch (error: any) {
      throw new Error(`Failed to get post: ${error.message}`);
    }
  }
  async getAllPost(
    page: number = 1,
    limit: number = 10
  ): Promise<IPostServiceResponsePaginated> {
    try {
      // Calculate skip value
      const skip = (page - 1) * limit;
      const posts = await this._postRepo.findAllWithMediaAndCreator(
        skip,
        limit
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

      // Get the total number of posts for pagination
      const totalPosts = await this._postRepo.totalPosts();

      // Return paginated posts with total count
      return {
        posts: postsWithMediaUrls,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new Error(`Failed to get posts: ${(error as Error).message}`);
    }
  }
  // updaeted delete,getuserspostss
  async deletePost(postId: string, userId: string): Promise<IPost | null> {
    try {
      // First get the post to check ownership and get media IDs
      const post = await this._postRepo.findById(postId);
      if (!post) throw new Error("Post not found");
      if (post.creatorId.toString() !== userId)
        throw new Error("Unauthorized - You can only delete your own posts");

      // Delete associated media
      if (post.mediaIds && post.mediaIds.length > 0) {
        const mediaIds = post.mediaIds.map((id) => id.toString());
        await this._mediaService.deleteMedia(mediaIds);
      }

      // Soft delete the post (or hard delete if you prefer)
      const deletedPost = await this._postRepo.softDelete(postId);
      // OR for hard delete:
      // const deletedPost = await this._postRepo.hardDelete(postId);

      return deletedPost;
    } catch (error) {
      throw new Error(`Failed to delete post: ${(error as Error).message}`);
    }
  }

  async getUsersPosts(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IPostServiceResponsePaginated> {
    try {
      // Calculate skip value
      const skip = (page - 1) * limit;

      // Get posts for this user
      const posts = await this._postRepo.findByCreator(skip, limit, userId);

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

      // Get the total number of posts for this user
      const totalPosts = await this._postRepo.countUserPosts(userId);
      console.log("Posttotalpsts", postsWithMediaUrls, "total.......");
      // Return paginated posts with total count
      return {
        posts: postsWithMediaUrls,
        totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
      };
    } catch (error) {
      throw new Error(`Failed to get user posts: ${(error as Error).message}`);
    }
  }
}
function alert(arg0: string) {
  throw new Error("Function not implemented.");
}
