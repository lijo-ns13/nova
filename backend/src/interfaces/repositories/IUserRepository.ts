import { PopulateOptions, Types } from "mongoose";

import { IUserWithStatus } from "../../repositories/mongo/UserRepository";
import { IBaseRepository } from "./IBaseRepository";
import { CreateEducationInputDTO } from "../../core/dtos/user/UserEducation.dto";
import { CreateExperienceInputDTO } from "../../core/dtos/user/userExperience";
import { CreateProjectInputDTO } from "../../core/dtos/user/userproject";
import { CreateCertificateInputDTO } from "../../core/dtos/user/certificate.dto";
import { IUser } from "../../repositories/entities/user.entity";
import { ISkill } from "../../repositories/entities/skill.entity";
import { IJob } from "../../repositories/entities/job.entity";
import { IUserEducation } from "../../repositories/entities/education.entity";
import { IUserExperience } from "../../repositories/entities/experience.entity";
import { IUserProject } from "../../repositories/entities/project.entity";
import { IUserCertificate } from "../../repositories/entities/certificate.entity";

export interface IUserRepository extends IBaseRepository<IUser> {
  // Core user operations
  updateSkillUser(userId: string, skillId: string): Promise<void>;
  addSkillToUser(userId: string, skillId: string): Promise<void>;
  getUserSkills(userId: string): Promise<ISkill[]>;
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
    education: CreateEducationInputDTO
  ): Promise<IUserEducation>;
  updateEducation(
    educationId: string,
    data: Partial<CreateEducationInputDTO>
  ): Promise<IUserEducation | null>;

  deleteEducation(userId: string, educationId: string): Promise<boolean>;
  getAllEducations(userId: string): Promise<IUserEducation[]>;
  // Experience operations
  addExperience(
    userId: string,
    experience: CreateExperienceInputDTO
  ): Promise<IUserExperience>;
  updateExperience(
    experienceId: string,
    data: Partial<CreateExperienceInputDTO>
  ): Promise<IUserExperience | null>;
  deleteExperience(userId: string, experienceId: string): Promise<boolean>;
  getAllExperiences(userId: string): Promise<IUserExperience[]>;

  // Project operations
  addProject(
    userId: string,
    project: CreateProjectInputDTO
  ): Promise<IUserProject>;
  updateProject(
    projectId: string,
    data: Partial<CreateProjectInputDTO>
  ): Promise<IUserProject | null>;
  deleteProject(userId: string, projectId: string): Promise<boolean>;
  getAllProjects(userId: string): Promise<IUserProject[]>;
  // Certificate operations
  addCertificate(
    userId: string,
    certificate: CreateCertificateInputDTO
  ): Promise<IUserCertificate>;
  updateCertificate(
    certificateId: string,
    data: Partial<CreateCertificateInputDTO>
  ): Promise<IUserCertificate | null>;
  deleteCertificate(userId: string, certificateId: string): Promise<boolean>;

  // Portfolio data access

  getAllCertificates(userId: string): Promise<IUserCertificate[]>;

  // Security
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean>;

  // serachUsers
  searchUsers(query: string, limit?: number): Promise<IUser[]>;
  isUsernameTaken(username: string, excludeUserId?: string): Promise<boolean>;
  findOne(
    filter: Record<string, unknown>,
    populateOptions?: string | PopulateOptions | (string | PopulateOptions)[]
  ): Promise<IUser | null>;
  // skill
  getUserSkillsById(userId: string): Promise<ISkill[] | undefined>;
  addSkillsToUser(
    userId: string,
    skillIds: Types.ObjectId[]
  ): Promise<IUser | null>;
  deleteUserSkill(userId: string, skillId: string): Promise<IUser | null>;
  // follow realted
  followUser(
    followerId: string,
    followingId: string
  ): Promise<{ follower: IUser | null; following: IUser | null }>;

  unfollowUser(
    followerId: string,
    followingId: string
  ): Promise<{ follower: IUser | null; following: IUser | null }>;

  getFollowers(userId: string): Promise<IUser[]>;

  getFollowing(userId: string): Promise<IUser[]>;

  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  getAllUsersExcept(userId: string): Promise<IUser[]>;
  getFollowersWithFollowingStatus(
    targetUserId: string,
    currentUserId: string
  ): Promise<IUserWithStatus[]>;
  getFollowingWithFollowingStatus(
    targetUserId: string,
    currentUserId: string
  ): Promise<IUserWithStatus[]>;
  getPaginatedUsersExcept(
    userId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ users: IUser[]; total: number }>;
  // new for amdindash
  countAllUsers(): Promise<number>;
  countActiveUsers(): Promise<number>;
  // updated
  clearExpiredPaymentSessions(): Promise<UpdateResult>;
  resetExpiredSubscriptions(): Promise<UpdateResult>;
  clearCancelledFlags(): Promise<UpdateResult>;
  updateUserPaymentSession(
    userId: string,
    sessionId: string | null,
    expiresAt: Date | null
  ): Promise<void>;
  updateUserSubscription(
    userId: string,
    subscriptionData: Partial<IUser>,
    unsetFields?: Record<string, 1>
  ): Promise<void>;
  updateSubscription(userId: string, update: Partial<IUser>): Promise<void>;
}
export interface UpdateResult {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedCount?: number;
  upsertedId?: Types.ObjectId | null;
}
