import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IPostRepository } from "../../interfaces/repositories/IPostRepository";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { CreatePostInput } from "../../core/dtos/user/post/post";
import { PostMapper, PostResponseDTO } from "../../mapping/user/postmapper";
import { IMedia } from "../../models/media.modal";
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
    const user = await this._userRepo.findById(post.creatorId.toString());
    if (!user) throw new Error("user not found");
    const mediaUrls = await Promise.all(
      mediaIds.map((id) => this._mediaService.getMediaUrlById(id))
    );

    return PostMapper.toDTO(post, mediaUrls, user);
  }

  async editPost(
    postId: string,
    description: string
  ): Promise<PostResponseDTO | null> {
    const post = await this._postRepo.updatePost(postId, description);
    if (!post) return null;

    const mediaUrls = await Promise.all(
      post.mediaIds.map((id) =>
        this._mediaService.getMediaUrlById(id.toString())
      )
    );
    const user = await this._userRepo.findById(post.creatorId.toString());
    if (!user) throw new Error("user not found");

    return PostMapper.toDTO(post, mediaUrls, user);
  }

  async getPost(postId: string): Promise<PostResponseDTO | null> {
    const post = await this._postRepo.getPostById(postId);
    if (!post) throw new Error("post not found");
    if (!post.mediaIds) throw new Error("media not found");
    const user = await this._userRepo.findById(post.creatorId.toString());
    if (!user) throw new Error("user not found");
    const media = await Promise.all(
      post.mediaIds.map((id) =>
        this._mediaService.getMediaUrlById(id.toString())
      )
    );

    return PostMapper.toDTO(post, media, user);
  }

  async getAllPost(page: number, limit: number): Promise<PostResponseDTO[]> {
    const posts = await this._postRepo.getAllPosts(page, limit);

    return await Promise.all(
      posts.map(async (post) => {
        const media = await Promise.all(
          post.mediaIds.map((id) =>
            this._mediaService.getMediaUrlById(id.toString())
          )
        );
        const user = await this._userRepo.findById(post.creatorId.toString());
        if (!user) throw new Error("user not found");
        return PostMapper.toDTO(post, media, user);
      })
    );
  }

  async deletePost(postId: string): Promise<void> {
    await this._postRepo.deletePost(postId);
  }
}
