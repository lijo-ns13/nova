import { IUser } from "../../models/user.modal";
export interface GetUserProfileResponseDTO {
  id: string;
  name: string;
  username: string;
  email: string;
  headline?: string;
  about?: string;
  profilePicture?: string;
}

export class UserProfileMapper {
  static toProfileDTO(user: IUser): GetUserProfileResponseDTO {
    return {
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      headline: user.headline,
      about: user.about,
      profilePicture: user.profilePicture,
    };
  }
}
