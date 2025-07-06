// src/core/dtos/response/admin/admin.user.response.dto.ts

export interface UserSummaryDTO {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  isBlocked: boolean;
}

export interface UserPaginatedResponse {
  users: UserSummaryDTO[];
  pagination: {
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    usersPerPage: number;
  };
}
