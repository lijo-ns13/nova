export interface GetUserProfileResponseDTO {
  id: string;
  name: string;
  username: string;
  email: string;
  headline: string;
  about: string;
  profilePicture: string | null; // signed URL
  skills: string[];
  certifications: string[];
  experiences: string[];
  educations: string[];
  projects: string[];
  followersCount: number;
  followingCount: number;
  appliedJobs: string[];
  savedJobs: string[];
  appliedJobCount: number;
  createdPostCount: number;
}
export interface UpdateUserProfileInputDTO {
  name?: string;
  username?: string;
  headline?: string;
  about?: string;
}
