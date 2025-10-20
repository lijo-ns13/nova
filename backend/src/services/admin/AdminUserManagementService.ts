import { inject, injectable } from "inversify";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { TYPES } from "../../di/types";
import { IAdminUserManagementService } from "../../interfaces/services/IAdminUserManagementService";
import { IUserMapper } from "../../mapping/admin/admin.user.mapper";
import {
  UserPaginatedResponse,
  UserSummaryDTO,
} from "../../dtos/response/admin/admin.user.response.dto";
import logger from "../../utils/logger";
import { COMMON_MESSAGES } from "../../constants/message.constants";

@injectable()
export class AdminUserManagementService implements IAdminUserManagementService {
  private logger = logger.child({ service: "AdminUserManagementService" });

  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TYPES.UserMapper) private readonly _userMapper: IUserMapper
  ) {}

  async blockUser(userId: string): Promise<UserSummaryDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      this.logger.warn(COMMON_MESSAGES.USER_NOT_FOUND);
      throw new Error(COMMON_MESSAGES.USER_NOT_FOUND);
    }

    if (user.isBlocked) {
      this.logger.warn(COMMON_MESSAGES.ALREADY_BLOCKED);
      throw new Error(COMMON_MESSAGES.ALREADY_BLOCKED);
    }

    const updatedUser = await this._userRepository.updateUser(userId, {
      isBlocked: true,
    });
    if (!updatedUser) {
      this.logger.warn(COMMON_MESSAGES.USER_NOT_UPDATED);
      throw new Error(COMMON_MESSAGES.USER_NOT_UPDATED);
    }
    return this._userMapper.toSummaryDTO(updatedUser);
  }

  async unblockUser(userId: string): Promise<UserSummaryDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      this.logger.warn(COMMON_MESSAGES.USER_NOT_FOUND);
      throw new Error(COMMON_MESSAGES.USER_NOT_FOUND);
    }

    if (!user.isBlocked) {
      this.logger.warn(COMMON_MESSAGES.ALREADY_UNBLOCKED);
      throw new Error(COMMON_MESSAGES.ALREADY_UNBLOCKED);
    }

    const updatedUser = await this._userRepository.updateUser(userId, {
      isBlocked: false,
    });

    if (!updatedUser) {
      this.logger.warn(COMMON_MESSAGES.USER_NOT_UPDATED);
      throw new Error(COMMON_MESSAGES.USER_NOT_UPDATED);
    }

    return this._userMapper.toSummaryDTO(updatedUser);
  }

  async getUsers(
    page: number,
    limit: number,
    search?: string
  ): Promise<UserPaginatedResponse> {
    this.logger.info(
      `Fetching users: page=${page}, limit=${limit}, search=${search || ""}`
    );
    if (page <= 0 || limit <= 0) {
      this.logger.warn(
        `Invalid pagination values: page=${page}, limit=${limit}`
      );
      throw new Error(COMMON_MESSAGES.INVALID_PAGINATION_VALUES);
    }

    const { users, totalUsers } = await this._userRepository.findUsers(
      page,
      limit,
      search
    );

    // *** mapper
    const entities = await Promise.all(
      users.map((user) => this._userMapper.toSummaryDTO(user))
    );

    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users: entities,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        usersPerPage: limit,
      },
    };
  }
}
