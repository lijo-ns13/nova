import { IJob } from "../../../infrastructure/database/models/job.modal";
import { IUser } from "../../../infrastructure/database/models/user.modal";
import { IUserCertificate } from "../../../infrastructure/database/models/userCertificate.model";
import { IUserEducation } from "../../../infrastructure/database/models/userEducation.model";
import { IUserExperience } from "../../../infrastructure/database/models/userExperience.model";
import { IUserProject } from "../../../infrastructure/database/models/userProject.model";

export interface IUserRepository {
  // Core user operations
  createUser(userData: Partial<IUser>): Promise<IUser>;
  updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
  findByEmail(email: string, isPassword?: boolean): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
  findByGoogleId(googleId: string): Promise<IUser | null>;

  // Job-related operations
  addToAppliedJobs(userId: string, jobId: string): Promise<void>;
  addToSavedJobs(userId: string, jobId: string): Promise<void>;
  removeFromSavedJobs(userId: string, jobId: string): Promise<void>;
  getSavedJobs(userId: string): Promise<(IUser & { savedJobs: IJob[] }) | null>;
  getAppliedJobs(
    userId: string
  ): Promise<(IUser & { appliedJobs: IJob[] }) | null>;

  // User management
  findUsers(
    page: number,
    limit: number,
    searchQuery?: string
  ): Promise<{ users: IUser[]; totalUsers: number }>;

  // Profile operations
  getUserProfile(userId: string): Promise<IUser | null>;
  getUserProfileWithDetails(userId: string): Promise<IUser | null>;
  updateUserProfile(
    userId: string,
    data: Partial<IUser>
  ): Promise<IUser | null>;
  updateProfileImage(userId: string, imageUrl: string): Promise<IUser | null>;
  deleteProfileImage(userId: string): Promise<boolean>;

  // Education operations
  addEducation(
    userId: string,
    education: IUserEducation
  ): Promise<IUserEducation>;
  updateEducation(
    educationId: string,
    data: Partial<IUserEducation>
  ): Promise<IUserEducation | null>;
  deleteEducation(userId: string, educationId: string): Promise<boolean>;

  // Experience operations
  addExperience(
    userId: string,
    experience: IUserExperience
  ): Promise<IUserExperience>;
  updateExperience(
    experienceId: string,
    data: Partial<IUserExperience>
  ): Promise<IUserExperience | null>;
  deleteExperience(userId: string, experienceId: string): Promise<boolean>;

  // Project operations
  addProject(userId: string, project: IUserProject): Promise<IUserProject>;
  updateProject(
    projectId: string,
    data: Partial<IUserProject>
  ): Promise<IUserProject | null>;
  deleteProject(userId: string, projectId: string): Promise<boolean>;

  // Certificate operations
  addCertificate(
    userId: string,
    certificate: IUserCertificate
  ): Promise<IUserCertificate>;
  updateCertificate(
    certificateId: string,
    data: Partial<IUserCertificate>
  ): Promise<IUserCertificate | null>;
  deleteCertificate(userId: string, certificateId: string): Promise<boolean>;

  // Portfolio data access
  getAllEducations(userId: string): Promise<IUserEducation[]>;
  getAllExperiences(userId: string): Promise<IUserExperience[]>;
  getAllProjects(userId: string): Promise<IUserProject[]>;
  getAllCertificates(userId: string): Promise<IUserCertificate[]>;

  // Security
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean>;

  // serachUsers
  searchUsers(query: string, limit?: number): Promise<IUser[]>;
}
