import { inject } from "inversify";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { TYPES } from "../../di/types";
import { IAdminUserManagementService } from "../../interfaces/services/IAdminUserManagementService";
import { IUser } from "../../models/user.modal";

export class AdminUserManagementService implements IAdminUserManagementService {
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository
  ) {}
  // Block user
  async blockUser(userId: string) {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.isBlocked) throw new Error("User is already blocked");

    return this._userRepository.updateUser(userId, { isBlocked: true });
  }

  // Unblock user
  async unblockUser(userId: string) {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    if (!user.isBlocked) throw new Error("User is already unblocked");

    return this._userRepository.updateUser(userId, { isBlocked: false });
  }

  // Get users with pagination
  async getUsers(page: number = 1, limit: number = 1, searchQuery?: string) {
    try {
      const { users, totalUsers } = await this._userRepository.findUsers(
        page,
        limit,
        searchQuery
      );

      if (!users || typeof totalUsers !== "number") {
        throw new Error("Users or total count not found");
      }

      const totalPages = Math.ceil(totalUsers / limit);

      return {
        users,
        pagination: {
          totalUsers,
          totalPages,
          currentPage: page,
          usersPerPage: limit,
        },
      };
    } catch (error) {
      throw new Error(
        `AdminUserService.getUsers error: ${(error as Error).message}`
      );
    }
  }
}
