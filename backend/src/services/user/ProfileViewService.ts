import { injectable, inject } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IProfileViewService } from "../../interfaces/services/IProfileViewService";
import { IPostRepository } from "../../interfaces/repositories/IPostRepository";
import { IMediaService } from "../../interfaces/services/Post/IMediaService";
import { IUser } from "../../repositories/entities/user.entity";
import { IPost } from "../../repositories/entities/post.entity";
import {
  IPostServiceResponsePaginated,
  IUserProfileDTO,
} from "../../core/entities/post";

import { COMMON_MESSAGES } from "../../constants/message.constants";
import { Types } from "mongoose";
import { ProfileViewMapper } from "../../mapping/profile.view.mapper";

@injectable()
export class ProfileViewService implements IProfileViewService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,

    @inject(TYPES.PostRepository)
    private readonly _postRepository: IPostRepository,

    @inject(TYPES.MediaService)
    private readonly _mediaService: IMediaService
  ) {}

  async getUserBasicData(username: string): Promise<IUserProfileDTO> {
    const userData = await this._userRepository.findOne({ username }, [
      { path: "certifications" },
      { path: "experiences" },
      { path: "projects" },
      { path: "educations" },
    ]);

    if (!userData) {
      throw new Error(COMMON_MESSAGES.USERDATA_NOT_FOUND);
    }

    const mappedUser = await ProfileViewMapper.toProfileDTO(
      userData,
      this._mediaService
    );
    return mappedUser;
  }

  async getUserPostData(
    page: number,
    limit: number,
    username: string
  ): Promise<IPostServiceResponsePaginated> {
    const user = await this._userRepository.findOne({ username });
    if (!user) {
      throw new Error(COMMON_MESSAGES.USER_NOT_FOUND);
    }

    const userId: Types.ObjectId | undefined = user._id;
    if (!userId) {
      throw new Error(COMMON_MESSAGES.USERID_NOT_FOUND);
    }

    const posts: (IPost & { mediaIds?: (Types.ObjectId | any)[] })[] =
      await this._postRepository.findByCreator(page, limit, userId.toString());

    // *******mapper
    const postsWithMediaUrls = await ProfileViewMapper.toServiceResponseList(
      posts,
      this._mediaService
    );

    return {
      posts: postsWithMediaUrls,
      currentPage: page,
    };
  }
}
