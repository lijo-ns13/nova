import { injectable, inject } from "inversify";
import { IPostRepository } from "../../../core/interfaces/repositories/IPostRepository";
import { Types } from "mongoose";
import { TYPES } from "../../../di/types";
import { IMediaService } from "../../../core/interfaces/services/Post/IMediaService";
import { IPost } from "../../database/models/post.modal";

@injectable()
export class PostService {
  constructor(
    @inject(TYPES.PostRepository) private postRepo: IPostRepository,
    @inject(TYPES.MediaService) private mediaService: IMediaService
  ) {}

  async createPost(
    creatorId: string,
    creatorName: string,
    creatorAvatar: string,
    description: string,
    mediaFiles: Express.Multer.File[]
  ): Promise<IPost> {
    let mediaIds: string[] = [];

    try {
      mediaIds = await this.mediaService.uploadMedia(
        mediaFiles,
        creatorId,
        "User"
      );

      const post = await this.postRepo.create({
        creatorId: new Types.ObjectId(creatorId),
        creatorName,
        creatorAvatar,
        description,
        mediaIds: mediaIds.map((id) => new Types.ObjectId(id)),
      });

      return post;
    } catch (error) {
      // Cleanup uploaded media if post creation fails
      if (mediaIds.length > 0) {
        await this.mediaService.deleteMedia(mediaIds).catch(console.error);
      }
      throw new Error(`Post creation failed: `);
    }
  }
}
