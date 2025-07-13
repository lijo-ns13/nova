// PostMapper.ts

import { IPost } from "../../models/post.modal";
import { IUser } from "../../models/user.modal";

// postResponse.dto.ts
export interface PostResponseDTO {
  id: string;
  description: string;
  userId: string;
  username: string;
  profilePicture: string;
  headline: string;
  media: {
    url: string;
    mimeType: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface MediaDTO {
  url: string;
  mimeType: string;
}

interface ToDTOParams {
  post: IPost;
  user: IUser;
  profilePictureUrl: string;
  mediaUrls: MediaDTO[];
}

export class PostMapper {
  static toDTO({
    post,
    user,
    profilePictureUrl,
    mediaUrls,
  }: ToDTOParams): PostResponseDTO {
    return {
      id: post._id.toString(),
      description: post.description || "",
      userId: user._id.toString(),
      username: user.username,
      profilePicture: profilePictureUrl,
      headline: user.headline || "",
      media: mediaUrls,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }
}
