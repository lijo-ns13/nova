export interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  isBlocked: boolean;
}

export interface Pagination {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  usersPerPage: number;
}

export interface UserResponse {
  data: {
    users: User[];
    pagination: Pagination;
  };
}
