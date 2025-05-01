import { inject } from "inversify";
import { IUserRepository } from "../../../core/interfaces/repositories/IUserRepository";
import { TYPES } from "../../../di/types";
import { IAdminUserManagementService } from "../../../core/interfaces/services/IAdminUserManagementService";
import { IUser } from "../../../infrastructure/database/models/user.modal";

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
  async getUsers(page: number = 1, limit: number = 10, searchQuery?: string) {
    try {
      const { users, totalUsers } = await this.userRepository.findUsers(
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

  async searchUsers(query: string): Promise<IUser[]> {
    if (!query.trim()) return [];
    console.log("quesry in searachusers service", query);
    console.log("serachUersService", this.userRepository.searchUsers(query));
    return this.userRepository.searchUsers(query);
  }
}
