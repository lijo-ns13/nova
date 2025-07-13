export interface GetUserProfileResponseDTO {
  id: string;
  name: string;
  username: string;
  email: string;
  headline: string;
  about: string;
  profilePicture?: string; // signed URL
  followersCount: number;
  followingCount: number;
  appliedJobCount: number;
  createdPostCount: number;
}
export interface UpdateUserProfileInputDTO {
  name?: string;
  username?: string;
  headline?: string;
  about?: string;
}
