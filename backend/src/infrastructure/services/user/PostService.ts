// PostService.ts
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
    // 1. Upload to S3 via MediaService
    const mediaIds = await this.mediaService.uploadMedia(
      mediaFiles,
      creatorId,
      "User"
    );
    const mediaObjectIds = mediaIds.map((id) => new Types.ObjectId(id));
    // 3. Create post
    const post = await this.postRepo.create({
      creatorId: new Types.ObjectId(creatorId),
      creatorName,
      creatorAvatar,
      description,
      mediaIds: mediaObjectIds,
    });

    return post;
  }
}
