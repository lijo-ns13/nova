import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IPostRepository } from "../../interfaces/repositories/IPostRepository";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { CreatePostInput } from "../../core/dtos/user/post/post";
import {
  CreatorDTO,
  PostMapper,
  PostResponseDTO,
} from "../../mapping/user/postmapper";
import { IMedia } from "../../models/media.modal";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import logger from "../../utils/logger";
import { MediaUrlDTO } from "./MediaService";

@injectable()
export class PostService {
  private logger = logger.child({ context: "userpostservice" });
  constructor(
    @inject(TYPES.PostRepository) private _postRepo: IPostRepository,
    @inject(TYPES.MediaService) private _mediaService: IMediaService,
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}

  private async resolveCreatorDTO(creatorId: string): Promise<CreatorDTO> {
    const user = await this._userRepo.findById(creatorId);
    if (!user) {
      this.logger.error("User not found");
      throw new Error("User not found");
    }

    let profilePictureUrl: string | null = null;
    if (user.profilePicture) {
      try {
        profilePictureUrl = await this._mediaService.getMediaUrl(
          user.profilePicture
        );
      } catch (err) {
        this.logger.warn("Failed to fetch profile picture URL");
      }
    }

    return {
      id: user._id.toString(),
      name: user.name,
      profilePicture: profilePictureUrl ?? "",
      headline: user.headline ?? "",
    };
  }

  private async resolveMedia(mediaIds: string[]): Promise<MediaUrlDTO[]> {
    return Promise.all(
      mediaIds.map(async (id) => {
        try {
          return await this._mediaService.getMediaUrlById(id.toString());
        } catch (err) {
          this.logger.warn("Failed to fetch media URL");
          return {
            url: "",
            mimeType: "image/jpeg" as MediaUrlDTO["mimeType"],
          };
        }
      })
    );
  }

  async createPost(
    creatorId: string,
    input: CreatePostInput,
    files: Express.Multer.File[]
  ): Promise<PostResponseDTO> {
    const mediaIds = await this._mediaService.uploadMedia(
      files,
      creatorId,
      "User"
    );
    const post = await this._postRepo.createPost(
      creatorId,
      input.description,
      mediaIds
    );
    const media = await this.resolveMedia(mediaIds.map((id) => id.toString()));
    const creator = await this.resolveCreatorDTO(creatorId);

    return PostMapper.toDTO(post, media, creator);
  }

  async editPost(
    postId: string,
    description: string
  ): Promise<PostResponseDTO | null> {
    const post = await this._postRepo.updatePost(postId, description);
    if (!post) return null;

    const media = await this.resolveMedia(
      post.mediaIds.map((id) => id.toString())
    );
    const creator = await this.resolveCreatorDTO(post.creatorId.toString());

    return PostMapper.toDTO(post, media, creator);
  }

  async getPost(postId: string): Promise<PostResponseDTO | null> {
    const post = await this._postRepo.getPostById(postId);
    if (!post) {
      this.logger.error("Post not found");
      throw new Error("Post not found");
    }

    const media = await this.resolveMedia(
      post.mediaIds.map((id) => id.toString())
    );
    const creator = await this.resolveCreatorDTO(post.creatorId.toString());

    return PostMapper.toDTO(post, media, creator);
  }

  async getAllPost(page: number, limit: number): Promise<PostResponseDTO[]> {
    const posts = await this._postRepo.getAllPosts(page, limit);

    const userCache = new Map<string, CreatorDTO>();
    const mediaCache = new Map<string, MediaUrlDTO>();

    return await Promise.all(
      posts.map(async (post) => {
        const mediaUrls: MediaUrlDTO[] = await Promise.all(
          post.mediaIds.map(async (id) => {
            const key = id.toString();
            if (mediaCache.has(key)) return mediaCache.get(key)!;
            try {
              const media = await this._mediaService.getMediaUrlById(key);
              mediaCache.set(key, media);
              return media;
            } catch (err) {
              this.logger.warn("Failed to fetch media URL");
              return {
                url: "",
                mimeType: "image/jpeg" as MediaUrlDTO["mimeType"],
              };
            }
          })
        );

        const creatorId = post.creatorId.toString();
        let creator = userCache.get(creatorId);
        if (!creator) {
          creator = await this.resolveCreatorDTO(creatorId);
          userCache.set(creatorId, creator);
        }

        return PostMapper.toDTO(post, mediaUrls, creator);
      })
    );
  }

  async deletePost(postId: string): Promise<void> {
    await this._postRepo.deletePost(postId);
  }
}
