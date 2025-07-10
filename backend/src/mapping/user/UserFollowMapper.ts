import { IUser } from "../../models/user.modal";
import { IUserWithStatus } from "../../repositories/mongo/UserRepository";

export type FollowResultDTO = {
  message: string;
};

export type NetworkUserDTO = {
  user: {
    id: string;
    name: string;
    username: string;
    profilePicture?: string;
    headline?: string;
  };
  isFollowing: boolean;
};

export type UserWithStatusDTO = {
  user: {
    id: string;
    name: string;
    username: string;
    profilePicture?: string;
    headline?: string;
  };
  isFollowing: boolean;
  isCurrentUser: boolean;
};

export const UserFollowMapper = {
  toUserWithStatusDTO(input: IUserWithStatus): UserWithStatusDTO {
    const { user, isFollowing, isCurrentUser } = input;
    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture,
        headline: user.headline,
      },
      isFollowing,
      isCurrentUser,
    };
  },

  toNetworkUserDTO(user: IUser, isFollowing: boolean): NetworkUserDTO {
    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        profilePicture: user.profilePicture,
        headline: user.headline,
      },
      isFollowing,
    };
  },
};
