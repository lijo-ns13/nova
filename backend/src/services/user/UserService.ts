import { inject } from "inversify";
import { TYPES } from "../../di/types";
import { IUserService } from "../../interfaces/services/IUserService";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUser } from "../../repositories/entities/user.entity";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { Types } from "mongoose";

export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepo: IUserRepository,
    @inject(TYPES.MediaService) private readonly _mediaService: IMediaService
  ) {}
  async getUserById(userId: string): Promise<{
    _id: string;
    name: string;
    profilePicture: string | null;
  } | null> {
    const user = await this._userRepo.findById(userId);
    if (!user) return null;
    let profilePictureUrl: string | null = null;
    if (user.profilePicture) {
      try {
        profilePictureUrl = await this._mediaService.getMediaUrl(
          user.profilePicture
        );
      } catch (err) {
        console.warn(`Failed to get signed URL for user ${user._id}:`, err);
      }
    }
    const userData = {
      _id: user._id.toString(),
      name: user.name,
      profilePicture: profilePictureUrl,
    };
    return userData;
  }
  async getUserData(userId: string): Promise<IUser | null> {
    return await this._userRepo.findById(userId);
  }
}
