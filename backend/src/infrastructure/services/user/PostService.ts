import { injectable, inject } from "inversify";
import { IPostRepository } from "../../../core/interfaces/repositories/IPostRepository";
import { Types } from "mongoose";
import { TYPES } from "../../../di/types";
import { IMediaService } from "../../../core/interfaces/services/Post/IMediaService";
import postModal, { IPost } from "../../database/models/post.modal";
import { IMedia } from "../../database/models/media.modal";
import {
  IPostServiceResponse,
  IPostServiceResponsePaginated,
} from "../../../core/entities/post";

@injectable()
export class PostService {
  constructor(
    @inject(TYPES.PostRepository) private _postRepo: IPostRepository,
    @inject(TYPES.MediaService) private _mediaService: IMediaService
  ) {}

  async createPost(
    creatorId: string,
    description: string,
    mediaFiles: Express.Multer.File[]
  ): Promise<IPost> {
    let mediaIds: string[] = [];

    try {
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

      return post;
    } catch (error: any) {
      // Cleanup uploaded media if post creation fails
      if (mediaIds.length > 0) {
        await this._mediaService.deleteMedia(mediaIds).catch(console.error);
      }
      throw new Error(`Post creation failed:${error.message} `);
    }
  }
  // Get a single post by its ID, including media URLs
  async getPost(postId: string): Promise<IPostServiceResponse> {
    try {
      // Fetch post by ID, populating mediaIds and userId fields
      const post = await this._postRepo.getPost(postId);
      if (!post) throw new Error("Post not found");

      // Map media IDs to signed URLs
      const mediaUrls = await Promise.all(
        post.mediaIds.map(async (media: any) => {
          return await this._mediaService.getMediaUrl(media.s3Key);
        })
      );
      const postData: IPostServiceResponse = {
        _id: postId,
        creatorId: post.creatorId,
        description: post.description,
        mediaUrls: mediaUrls,
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
              return await this._mediaService.getMediaUrl(media.s3Key);
            })
          );

          return {
            _id: post._id,
            creatorId: post.creatorId,
            description: post.description,
            mediaUrls: mediaUrls,
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
    } catch (error: any) {
      throw new Error(`Failed to get posts: ${error.message}`);
    }
  }
}
