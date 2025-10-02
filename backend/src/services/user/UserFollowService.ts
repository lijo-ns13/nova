import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUserFollowService } from "../../interfaces/services/IUserFollowService";
import { INotificationService } from "../../interfaces/services/INotificationService";
import { IUserWithStatus } from "../../repositories/mongo/UserRepository";
import {
  FollowResultDTO,
  NetworkUserDTO,
  UserFollowMapper,
  UserWithStatusDTO,
} from "../../mapping/user/UserFollowMapper";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { NotificationType } from "../../constants/notification.type.constant";
import { USER_MESSAGES } from "../../constants/message.constants";

@injectable()
export class UserFollowService implements IUserFollowService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TYPES.NotificationService)
    private readonly _notificationService: INotificationService,
    @inject(TYPES.MediaService) private readonly _mediaService: IMediaService
  ) {}

  async followUser(
    followerId: string,
    followingId: string
  ): Promise<FollowResultDTO> {
    if (followerId === followingId) {
      throw new Error(USER_MESSAGES.FOLLOW.SELF_FOLLOW_NOT_ALLOWED);
    }

    const alreadyFollowing = await this._userRepository.isFollowing(
      followerId,
      followingId
    );
    if (alreadyFollowing) {
      throw new Error(USER_MESSAGES.FOLLOW.ALREADY_FOLLOWING);
    }

    const { follower, following } = await this._userRepository.followUser(
      followerId,
      followingId
    );

    if (!follower || !following) {
      throw new Error(USER_MESSAGES.FOLLOW.FOLLOW_FAILED);
    }

    const followerUser = await this._userRepository.findById(followerId);
    if (followerUser) {
      await this._notificationService.sendNotification(
        followingId,
        `${followerUser.name} followed you`,
        NotificationType.FOLLOW,
        followerId
      );
    }

    return { message: USER_MESSAGES.FOLLOW.FOLLOW_SUCCESS };
  }

  async unfollowUser(
    followerId: string,
    followingId: string
  ): Promise<FollowResultDTO> {
    if (followerId === followingId) {
      throw new Error(USER_MESSAGES.FOLLOW.SELF_UNFOLLOW_NOT_ALLOWED);
    }

    const isFollowing = await this._userRepository.isFollowing(
      followerId,
      followingId
    );
    if (!isFollowing) {
      throw new Error(USER_MESSAGES.FOLLOW.NOT_FOLLOWING);
    }

    const { follower, following } = await this._userRepository.unfollowUser(
      followerId,
      followingId
    );

    if (!follower || !following) {
      throw new Error(USER_MESSAGES.FOLLOW.UNFOLLOW_FAILED);
    }

    return { message: USER_MESSAGES.FOLLOW.UNFOLLOW_SUCCESS };
  }

  async getFollowers(
    targetUserId: string,
    currentUserId: string
  ): Promise<UserWithStatusDTO[]> {
    const followers: IUserWithStatus[] =
      await this._userRepository.getFollowersWithFollowingStatus(
        targetUserId,
        currentUserId
      );

    return Promise.all(
      followers.map(async (follower) => {
        const signedProfilePic = follower.user.profilePicture
          ? await this._mediaService.getMediaUrl(follower.user.profilePicture)
          : undefined;

        return UserFollowMapper.toUserWithStatusDTO({
          ...follower,
          user: {
            ...follower.user,
            profilePicture: signedProfilePic,
          },
        });
      })
    );
  }

  async getFollowing(
    targetUserId: string,
    currentUserId: string
  ): Promise<UserWithStatusDTO[]> {
    const following: IUserWithStatus[] =
      await this._userRepository.getFollowingWithFollowingStatus(
        targetUserId,
        currentUserId
      );

    return Promise.all(
      following.map(async (followedUser) => {
        const signedProfilePic = followedUser.user.profilePicture
          ? await this._mediaService.getMediaUrl(
              followedUser.user.profilePicture
            )
          : undefined;

        return UserFollowMapper.toUserWithStatusDTO({
          ...followedUser,
          user: {
            ...followedUser.user,
            profilePicture: signedProfilePic,
          },
        });
      })
    );
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return this._userRepository.isFollowing(followerId, followingId);
  }
  async getNetworkUsers(
    currentUserId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ users: NetworkUserDTO[]; total: number }> {
    const [{ users: allUsers, total }, followingUsers] = await Promise.all([
      this._userRepository.getPaginatedUsersExcept(
        currentUserId,
        page,
        limit,
        search
      ),
      this._userRepository.getFollowing(currentUserId),
    ]);

    const followingIds = new Set(followingUsers.map((u) => u._id.toString()));

    const mappedUsers = await Promise.all(
      allUsers.map(async (user) => {
        const signedProfilePic = user.profilePicture
          ? await this._mediaService.getMediaUrl(user.profilePicture)
          : "";

        return UserFollowMapper.toNetworkUserDTO(
          user,
          signedProfilePic,
          followingIds.has(user._id.toString())
        );
      })
    );

    mappedUsers.sort((a, b) =>
      a.isFollowing === b.isFollowing ? 0 : a.isFollowing ? -1 : 1
    );

    return { users: mappedUsers, total };
  }
}
