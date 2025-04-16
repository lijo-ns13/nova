import { inject } from "inversify";
import { IUserRepository } from "../../../core/interfaces/repositories/IUserRepository";
import { TYPES } from "../../../di/types";
import { IAdminUserManagementService } from "../../../core/interfaces/services/IAdminUserManagementService";

export class AdminUserManagementService implements IAdminUserManagementService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository
  ) {}
  // Block user
  async blockUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.isBlocked) throw new Error("User is already blocked");

    return this.userRepository.updateUser(userId, { isBlocked: true });
  }

  // Unblock user
  async unblockUser(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error("User not found");
    if (!user.isBlocked) throw new Error("User is already unblocked");

    return this.userRepository.updateUser(userId, { isBlocked: false });
  }

  // Get users with pagination
  async getUsers(page: number = 1, limit: number = 10) {
    const { users, totalUsers } = await this.userRepository.findUsers(
      page,
      limit
    );

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
  }
}
