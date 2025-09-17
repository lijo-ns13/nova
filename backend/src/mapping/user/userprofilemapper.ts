import { GetUserProfileResponseDTO } from "../../core/dtos/user/getuserresponse.dto";
import { IUser } from "../../repositories/entities/user.entity";

export class UserProfileMapper {
  static toProfileDTO(
    user: IUser,
    signedProfilePictureUrl?: string
  ): GetUserProfileResponseDTO {
    return {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      headline: user.headline || "",
      about: user.about || "",
      profilePicture: signedProfilePictureUrl, // signed URL injected here
      followersCount: user.followers.length,
      followingCount: user.following.length,
      appliedJobCount: user.appliedJobCount || 0,
      createdPostCount: user.createdPostCount || 0,
    };
  }
}
