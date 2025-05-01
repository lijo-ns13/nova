export interface User {
  _id: string;
  name: string;
  email: string;
  isBlocked: boolean;
  profilePicture?: string;
}

export interface Pagination {
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  usersPerPage: number;
}
