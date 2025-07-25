// src/mappers/UserMapper.ts
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { UserSummaryDTO } from "../../dtos/response/admin/admin.user.response.dto";
import { IUser } from "../../models/user.modal";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
export interface IUserMapper {
  toSummaryDTO(user: IUser): Promise<UserSummaryDTO>;
}
@injectable()
export class UserMapper implements IUserMapper {
  constructor(
    @inject(TYPES.MediaService) private _mediaService: IMediaService
  ) {}

  async toSummaryDTO(user: IUser): Promise<UserSummaryDTO> {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture
        ? await this._mediaService.getMediaUrl(user.profilePicture)
        : "",
      isBlocked: user.isBlocked,
    };
  }
}
