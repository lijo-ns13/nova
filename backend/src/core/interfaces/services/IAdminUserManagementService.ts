import { IUser } from "../../../infrastructure/database/models/user.modal";

export interface IAdminUserManagementService {
  blockUser(userId: string): Promise<IUser | null>;
  unblockUser(userId: string): Promise<IUser | null>;
  getUsers(
    page?: number,
    limit?: number,
    searchQuery?: string
  ): Promise<{
    users: IUser[];
    pagination: {
      totalUsers: number;
      totalPages: number;
      currentPage: number;
      usersPerPage: number;
    };
  }>;
  searchUsers(query: string): Promise<IUser[]>;
}
