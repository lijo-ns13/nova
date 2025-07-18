import { inject, injectable } from "inversify";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { TYPES } from "../../di/types";
import { IAdminUserManagementService } from "../../interfaces/services/IAdminUserManagementService";
import { IUserMapper, UserMapper } from "../../mapping/admin/admin.user.mapper";
import {
  UserPaginatedResponse,
  UserSummaryDTO,
} from "../../dtos/response/admin/admin.user.response.dto";
import logger from "../../utils/logger";

@injectable()
export class AdminUserManagementService implements IAdminUserManagementService {
  private logger = logger.child({ service: "AdminUserManagementService" });

  constructor(
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES.UserMapper) private _userMapper: IUserMapper
  ) {}

  async blockUser(userId: string): Promise<UserSummaryDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      this.logger.warn(`User not found during block: ${userId}`);
      throw new Error("User not found");
    }

    if (user.isBlocked) {
      this.logger.warn(`User already blocked during block: ${userId}`);
      throw new Error("User already blocked");
    }

    const updatedUser = await this._userRepository.updateUser(userId, {
      isBlocked: true,
    });
    if (!updatedUser) {
      this.logger.warn("user not updated");
      throw new Error("user not updated");
    }
    return this._userMapper.toSummaryDTO(updatedUser);
  }

  async unblockUser(userId: string): Promise<UserSummaryDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      this.logger.warn(`User not found during unblock: ${userId}`);
      throw new Error("User not found during unblock");
    }

    if (!user.isBlocked) {
      this.logger.warn(`User already unblocked: ${userId}`);
      throw new Error("User already unblocked");
    }

    const updatedUser = await this._userRepository.updateUser(userId, {
      isBlocked: false,
    });

    if (!updatedUser) {
      this.logger.warn("User not updated for unblock");
      throw new Error("User not updated for unblock");
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
      throw new Error("Invalid pagination values");
    }

    const { users, totalUsers } = await this._userRepository.findUsers(
      page,
      limit,
      search
    );

    const summary = await Promise.all(
      users.map((user) => this._userMapper.toSummaryDTO(user))
    );

    const totalPages = Math.ceil(totalUsers / limit);

    return {
      users: summary,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        usersPerPage: limit,
      },
    };
  }
}
