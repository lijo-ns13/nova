import { ILike } from "../../../models/like.modal";
import { IUser } from "../../../models/user.modal";
import { ILikePopulated } from "../../../repositories/mongo/LikeRepository";

export interface LikeResponseDTO {
  user: {
    id: string;
    name: string;
    username: string;
    profilePicture: string | null;
  };
}
export class LikeMapper {
  static toDTO(
    like: ILikePopulated,
    profilePictureUrl: string | null
  ): LikeResponseDTO {
    return {
      user: {
        id: like.userId._id.toString(),
        name: like.userId.name,
        username: like.userId.username,
        profilePicture: profilePictureUrl,
      },
    };
  }
}
