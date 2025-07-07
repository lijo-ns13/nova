export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  isBlocked: boolean;
}

export interface Pagination {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  usersPerPage: number;
}

export interface PaginatedUserData {
  users: User[];
  pagination: Pagination;
}
