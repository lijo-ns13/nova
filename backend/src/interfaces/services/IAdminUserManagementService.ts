import {
  UserPaginatedResponse,
  UserSummaryDTO,
} from "../../dtos/response/admin/admin.user.response.dto";

export interface IAdminUserManagementService {
  blockUser(userId: string): Promise<UserSummaryDTO>;
  unblockUser(userId: string): Promise<UserSummaryDTO>;
  getUsers(
    page: number,
    limit: number,
    search?: string
  ): Promise<UserPaginatedResponse>;
}
