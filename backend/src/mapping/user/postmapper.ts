import { IPost } from "../../models/post.modal";
import { IUser } from "../../models/user.modal";
// src/dtos/post/PostResponseDTO.ts

export interface LikeDTO {
  _id: string;
  userId: string;
  createdAt: string;
}
export interface CreatorDTO {
  id: string;
  name: string;
  profilePicture: string;
  headline: string;
}
export interface MediaUrlDTO {
  url: string;
  mimeType:
    | "image/jpeg"
    | "image/png"
    | "image/webp"
    | "video/mp4"
    | "video/quicktime"
    | "application/pdf";
}

export interface PostResponseDTO {
  id: string;
  description?: string;
  creatorId: CreatorDTO;
  media: MediaUrlDTO[];
  likes: LikeDTO[];
  createdAt: string;
  updatedAt: string;
}
export class PostMapper {
  static toDTO(
    post: IPost,
    media: MediaUrlDTO[],
    creator: IUser
  ): PostResponseDTO {
    const likes: LikeDTO[] = Array.isArray(post.Likes)
      ? post.Likes.map((like) => ({
          _id: like._id.toString(),
          userId: like.userId.toString(),
          createdAt: like.createdAt.toISOString(),
        }))
      : [];

    return {
      id: post._id.toString(),
      description: post.description,
      creatorId: {
        id: creator._id.toString(),
        name: creator.name,
        profilePicture: creator.profilePicture || "",
        headline: creator.headline || "",
      },
      media,
      likes,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }
}
