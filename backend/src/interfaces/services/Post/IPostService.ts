import { CreatePostInput } from "../../../core/dtos/user/post/post";
import { PostResponseDTO } from "../../../mapping/user/postmapper";

export interface IPostService {
  createPost(
    creatorId: string,
    input: CreatePostInput,
    files: Express.Multer.File[]
  ): Promise<PostResponseDTO>;

  getPost(postId: string): Promise<PostResponseDTO | null>;

  getAllPost(page: number, limit: number): Promise<PostResponseDTO[]>;

  deletePost(postId: string): Promise<void>;

  editPost(
    postId: string,
    description: string
  ): Promise<PostResponseDTO | null>;
  getUsersPosts(
    userId: string,
    page: number,
    limit: number
  ): Promise<PostResponseDTO[]>;
}
