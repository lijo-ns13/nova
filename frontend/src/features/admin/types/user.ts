export interface UserResponse {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  isBlocked: boolean;
}

export interface PaginatedUserResponse {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
}
