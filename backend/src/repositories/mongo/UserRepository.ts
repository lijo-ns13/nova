import { inject, injectable } from "inversify";
import { FilterQuery, Model, Types, UpdateResult } from "mongoose";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../di/types";
import bcrypt from "bcryptjs";

import { CreateEducationInputDTO } from "../../core/dtos/user/UserEducation.dto";
import { CreateExperienceInputDTO } from "../../core/dtos/user/userExperience";
import { CreateProjectInputDTO } from "../../core/dtos/user/userproject";
import { CreateCertificateInputDTO } from "../../core/dtos/user/certificate.dto";
import { UpdateUserProfileInputDTO } from "../../core/dtos/user/getuserresponse.dto";
import { subDays } from "date-fns";
import { IUser } from "../entities/user.entity";
import { ISkill } from "../entities/skill.entity";
import { IJob } from "../entities/job.entity";
import { IUserEducation } from "../entities/education.entity";
import userEducationModel from "../models/user.education.model";
import { IUserExperience } from "../entities/experience.entity";
import userExpModel from "../models/user.exp.model";
import { IUserProject } from "../entities/project.entity";
import userProjectModel from "../models/user.project.model";
import { IUserCertificate } from "../entities/certificate.entity";
import userCertificateModel from "../models/user.certificate.model";
export interface IUserWithStatus {
  user: {
    _id: Types.ObjectId;
    name: string;
    username: string;
    profilePicture?: string;
    headline?: string;
  };
  isFollowing: boolean;
  isCurrentUser: boolean;
}
@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor(@inject(TYPES.UserModel) private userModel: Model<IUser>) {
    super(userModel);
  }

  async updateUserProfile(
    userId: string,
    data: UpdateUserProfileInputDTO
  ): Promise<IUser | null> {
    return await this.model
      .findByIdAndUpdate(userId, data, { new: true })
      .lean();
  }

  async isUsernameTaken(
    username: string,
    excludeUserId: string
  ): Promise<boolean> {
    const user = await this.model
      .findOne({
        username,
        _id: { $ne: excludeUserId },
      })
      .lean();

    return !!user;
  }
  // *
  // Profile Related Methods
  async getUserProfile(userId: string): Promise<IUser | null> {
    return this.findById(userId);
  }
  // *
  async getUserProfileWithDetails(userId: string): Promise<IUser | null> {
    return this.model
      .findById(userId)
      .populate("educations")
      .populate("experiences")
      .populate("projects")
      .populate("certificates");
  }
  // *
  async updateProfileImage(
    userId: string,
    imageUrl: string
  ): Promise<IUser | null> {
    return this.update(userId, { profilePicture: imageUrl });
  }
  // *
  // async updateUserProfile(
  //   userId: string,
  //   data: Partial<IUser>
  // ): Promise<IUser | null> {
  //   return this.findOneAndUpdate({ _id: userId }, data);
  // }
  // *
  async deleteProfileImage(userId: string): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(userId, {
      profilePicture: null,
    });
    return result !== null;
  }
  // async isUsernameTaken(
  //   username: string,
  //   excludeUserId?: string
  // ): Promise<boolean> {
  //   const existingUser = await this.model.findOne({
  //     username,
  //     _id: { $ne: excludeUserId },
  //   });
  //   return !!existingUser;
  // }
  async updateSkillUser(userId: string, skillId: string): Promise<void> {
    await this.update(userId, {
      $pull: {
        skills: new Types.ObjectId(skillId),
      },
    });
  }
  async addSkillToUser(userId: string, skillId: string): Promise<void> {
    await this.update(userId, {
      $addToSet: {
        skills: new Types.ObjectId(skillId),
      },
    });
  }
  async getUserSkills(userId: string): Promise<ISkill[]> {
    const user = await this.findOne(
      { _id: userId },
      { path: "skills", select: "_id title" }
    );

    if (!user || !user.skills || !Array.isArray(user.skills)) {
      return [];
    }

    return user.skills as ISkill[];
  }

  // User CRUD Operations
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return this.create(userData);
  }

  async updateUser(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return this.update(userId, updateData);
  }

  // Authentication Related Methods
  async findByEmail(email: string, isPassword = false): Promise<IUser | null> {
    const query = this.model.findOne({ email });
    return isPassword ? query.select("+password") : query;
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.model.findByIdAndUpdate(userId, { password: newPassword });
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return this.model.findOne({ googleId });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await this.model.findById(userId).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.password) {
      throw new Error("Google users can't change their password");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();
    return true;
  }

  // Job Related Methods
  async addToAppliedJobs(userId: string, jobId: string): Promise<void> {
    await this.model.findByIdAndUpdate(userId, {
      $addToSet: { appliedJobs: jobId },
    });
  }

  async addToSavedJobs(userId: string, jobId: string): Promise<void> {
    await this.model.findByIdAndUpdate(userId, {
      $addToSet: { savedJobs: jobId },
    });
  }

  async removeFromSavedJobs(userId: string, jobId: string): Promise<void> {
    await this.model.findByIdAndUpdate(userId, {
      $pull: { savedJobs: jobId },
    });
  }

  async getSavedJobs(
    userId: string
  ): Promise<(IUser & { savedJobs: IJob[] }) | null> {
    const user = await this.model.findById(userId).populate("savedJobs").lean();
    return user as (IUser & { savedJobs: IJob[] }) | null;
  }

  async getAppliedJobs(
    userId: string
  ): Promise<(IUser & { appliedJobs: IJob[] }) | null> {
    const user = await this.model
      .findById(userId)
      .populate("appliedJobs")
      .lean();
    return user as (IUser & { appliedJobs: IJob[] }) | null;
  }

  // Education Methods
  async addEducation(
    userId: string,
    education: CreateEducationInputDTO
  ): Promise<IUserEducation> {
    const newEducation = await userEducationModel.create({
      ...education,
      userId,
    });
    await this.model.findByIdAndUpdate(
      userId,
      { $push: { educations: newEducation._id } },
      { new: true }
    );
    return newEducation;
  }

  async updateEducation(
    educationId: string,
    data: Partial<CreateEducationInputDTO>
  ): Promise<IUserEducation | null> {
    return userEducationModel.findByIdAndUpdate(educationId, data, {
      new: true,
    });
  }

  async deleteEducation(userId: string, educationId: string): Promise<boolean> {
    await userEducationModel.findByIdAndDelete(educationId);
    await this.model.findByIdAndUpdate(userId, {
      $pull: { educations: educationId },
    });
    return true;
  }

  async getAllEducations(userId: string): Promise<IUserEducation[]> {
    return userEducationModel.find({ userId });
  }

  // Experience Methods
  async addExperience(
    userId: string,
    experience: CreateExperienceInputDTO
  ): Promise<IUserExperience> {
    const newExperience = await userExpModel.create({
      ...experience,
      userId,
    });
    await this.model.findByIdAndUpdate(
      userId,
      { $push: { experiences: newExperience._id } },
      { new: true }
    );
    return newExperience;
  }

  async updateExperience(
    experienceId: string,
    data: Partial<CreateExperienceInputDTO>
  ): Promise<IUserExperience | null> {
    return userExpModel.findByIdAndUpdate(experienceId, data, {
      new: true,
    });
  }

  async deleteExperience(
    userId: string,
    experienceId: string
  ): Promise<boolean> {
    await userExpModel.findByIdAndDelete(experienceId);
    await this.model.findByIdAndUpdate(userId, {
      $pull: { experiences: experienceId },
    });
    return true;
  }

  async getAllExperiences(userId: string): Promise<IUserExperience[]> {
    return userExpModel.find({ userId });
  }

  // Project Methods
  async addProject(
    userId: string,
    project: CreateProjectInputDTO
  ): Promise<IUserProject> {
    const newProject = await userProjectModel.create({ ...project, userId });
    await this.model.findByIdAndUpdate(
      userId,
      { $push: { projects: newProject._id } },
      { new: true }
    );
    return newProject;
  }

  async updateProject(
    projectId: string,
    data: Partial<CreateProjectInputDTO>
  ): Promise<IUserProject | null> {
    return userProjectModel.findByIdAndUpdate(projectId, data, { new: true });
  }

  async deleteProject(userId: string, projectId: string): Promise<boolean> {
    await userProjectModel.findByIdAndDelete(projectId);
    await this.model.findByIdAndUpdate(userId, {
      $pull: { projects: projectId },
    });
    return true;
  }

  async getAllProjects(userId: string): Promise<IUserProject[]> {
    return userProjectModel.find({ userId });
  }

  // Certificate Methods
  async addCertificate(
    userId: string,
    certificate: CreateCertificateInputDTO
  ): Promise<IUserCertificate> {
    const newCertificate = await userCertificateModel.create({
      ...certificate,
      userId,
    });
    await this.model.findByIdAndUpdate(
      userId,
      { $push: { certifications: newCertificate._id } },
      { new: true }
    );
    return newCertificate;
  }

  async updateCertificate(
    certificateId: string,
    data: Partial<CreateCertificateInputDTO>
  ): Promise<IUserCertificate | null> {
    return userCertificateModel.findByIdAndUpdate(certificateId, data, {
      new: true,
    });
  }

  async deleteCertificate(
    userId: string,
    certificateId: string
  ): Promise<boolean> {
    await userCertificateModel.findByIdAndDelete(certificateId);
    await this.model.findByIdAndUpdate(userId, {
      $pull: { certifications: certificateId },
    });
    return true;
  }

  async getAllCertificates(userId: string): Promise<IUserCertificate[]> {
    return userCertificateModel.find({ userId });
  }

  // Search and Admin Methods
  async findUsers(page: number, limit: number, searchQuery?: string) {
    const skip = (page - 1) * limit;
    let query = {};

    if (searchQuery?.trim()) {
      const regex = new RegExp(searchQuery, "i");
      query = { $or: [{ name: regex }, { email: regex }] };
    }

    const [users, totalUsers] = await Promise.all([
      this.model.find(query).skip(skip).limit(limit).select("-password").exec(),
      this.model.countDocuments(query),
    ]);

    return { users, totalUsers };
  }

  async searchUsers(query: string, limit = 10): Promise<IUser[]> {
    const regex = new RegExp(`^${query}`, "i");
    return this.model.find({ name: regex }).limit(limit);
  }

  // Skill Methods
  async getUserSkillsById(userId: string): Promise<ISkill[] | undefined> {
    const user = await this.model.findById(userId).populate("skills");
    return user?.skills as ISkill[] | undefined;
  }

  async addSkillsToUser(
    userId: string,
    skillIds: Types.ObjectId[]
  ): Promise<IUser | null> {
    return this.model
      .findByIdAndUpdate(
        userId,
        { $addToSet: { skills: { $each: skillIds } } },
        { new: true }
      )
      .populate("skills");
  }

  async deleteUserSkill(
    userId: string,
    skillId: string
  ): Promise<IUser | null> {
    return this.model
      .findByIdAndUpdate(
        userId,
        { $pull: { skills: new Types.ObjectId(skillId) } },
        { new: true }
      )
      .populate("skills");
  }

  // Follow/Unfollow Methods
  async followUser(
    followerId: string,
    followingId: string
  ): Promise<{ follower: IUser | null; following: IUser | null }> {
    const [follower, following] = await Promise.all([
      this.model.findByIdAndUpdate(
        followerId,
        { $addToSet: { following: new Types.ObjectId(followingId) } },
        { new: true }
      ),
      this.model.findByIdAndUpdate(
        followingId,
        { $addToSet: { followers: new Types.ObjectId(followerId) } },
        { new: true }
      ),
    ]);
    return { follower, following };
  }

  async unfollowUser(
    followerId: string,
    followingId: string
  ): Promise<{ follower: IUser | null; following: IUser | null }> {
    const [follower, following] = await Promise.all([
      this.model.findByIdAndUpdate(
        followerId,
        { $pull: { following: new Types.ObjectId(followingId) } },
        { new: true }
      ),
      this.model.findByIdAndUpdate(
        followingId,
        { $pull: { followers: new Types.ObjectId(followerId) } },
        { new: true }
      ),
    ]);
    return { follower, following };
  }

  async getFollowers(userId: string): Promise<IUser[]> {
    const user = await this.model.findById(userId).populate({
      path: "followers",
      select: "name username profilePicture headline",
    });
    return (user?.followers as IUser[]) || [];
  }

  async getFollowing(userId: string): Promise<IUser[]> {
    const user = await this.model.findById(userId).populate({
      path: "following",
      select: "name username profilePicture headline",
    });
    return (user?.following as IUser[]) || [];
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const user = await this.model.findOne({
      _id: followerId,
      following: new Types.ObjectId(followingId),
    });
    return !!user;
  }
  async getFollowersWithFollowingStatus(
    targetUserId: string,
    currentUserId: string
  ): Promise<IUserWithStatus[]> {
    const targetUser = await this.model.findById(targetUserId).populate<{
      followers: IUser[];
    }>({
      path: "followers",
      select: "_id name username profilePicture headline",
    });

    const currentUser = await this.model
      .findById(currentUserId)
      .select("following");
    const currentUserFollowingIds =
      currentUser?.following.map((id) => id.toString()) ?? [];

    return (targetUser?.followers ?? []).map((follower) => ({
      user: {
        _id: follower._id,
        name: follower.name,
        username: follower.username,
        profilePicture: follower.profilePicture,
        headline: follower.headline,
      },
      isFollowing: currentUserFollowingIds.includes(follower._id.toString()),
      isCurrentUser: follower._id.toString() === targetUserId, // 👈 NEW
    }));
  }
  // getFollowingWithFollowingStatus
  async getFollowingWithFollowingStatus(
    targetUserId: string,
    currentUserId: string
  ): Promise<IUserWithStatus[]> {
    const targetUser = await this.model.findById(targetUserId).populate<{
      following: IUser[];
    }>({
      path: "following",
      select: "_id name username profilePicture headline",
    });

    const currentUser = await this.model
      .findById(currentUserId)
      .select("following");
    const currentUserFollowingIds =
      currentUser?.following.map((id) => id.toString()) ?? [];

    return (targetUser?.following ?? []).map((followedUser) => ({
      user: {
        _id: followedUser._id,
        name: followedUser.name,
        username: followedUser.username,
        profilePicture: followedUser.profilePicture,
        headline: followedUser.headline,
      },
      isFollowing: currentUserFollowingIds.includes(
        followedUser._id.toString()
      ),
      isCurrentUser: followedUser._id.toString() === targetUserId, // 👈 NEW
    }));
  }

  async getAllUsersExcept(userId: string): Promise<IUser[]> {
    return this.model
      .find(
        { _id: { $ne: new Types.ObjectId(userId) } },
        { name: 1, username: 1, profilePicture: 1, headline: 1 }
      )
      .lean();
  }
  async getPaginatedUsersExcept(
    userId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<{ users: IUser[]; total: number }> {
    const baseFilter: FilterQuery<IUser> = {
      _id: { $ne: new Types.ObjectId(userId) },
    };

    if (search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      baseFilter.$or = [
        { name: regex },
        { username: regex },
        { headline: regex },
      ];
    }

    const projection: Partial<Record<keyof IUser, 1>> = {
      name: 1,
      username: 1,
      profilePicture: 1,
      headline: 1,
    };

    const [users, total] = await Promise.all([
      this.model
        .find(baseFilter, projection)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<IUser[]>(),
      this.model.countDocuments(baseFilter),
    ]);

    return { users, total };
  }
  // new for admin dash
  async countAllUsers(): Promise<number> {
    return this.model.countDocuments();
  }

  async countActiveUsers(): Promise<number> {
    return this.model.countDocuments({
      lastActive: { $gte: subDays(new Date(), 30) },
    });
  }
  //
  async clearExpiredPaymentSessions(): Promise<UpdateResult> {
    const result = await this.model.updateMany(
      { activePaymentSessionExpiresAt: { $lt: new Date() } },
      {
        $unset: { activePaymentSession: "", activePaymentSessionExpiresAt: "" },
      }
    );

    return {
      acknowledged: result.acknowledged,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      upsertedCount: result.upsertedCount,
      upsertedId: result.upsertedId || null,
    };
  }

  async resetExpiredSubscriptions(): Promise<UpdateResult> {
    const result = await this.model.updateMany(
      {
        $or: [
          { isSubscriptionActive: false },
          { subscriptionEndDate: { $lt: new Date() } },
          { subscription: null },
        ],
      },
      {
        $set: {
          isSubscriptionActive: false,
          subscriptionStartDate: null,
          subscriptionEndDate: null,
          subscription: null,
        },
      }
    );

    return {
      acknowledged: result.acknowledged,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      upsertedCount: result.upsertedCount,
      upsertedId: result.upsertedId || null,
    };
  }

  async clearCancelledFlags(): Promise<UpdateResult> {
    const result = await this.model.updateMany(
      {
        subscriptionCancelled: true,
        $or: [
          { isSubscriptionActive: false },
          { subscriptionEndDate: { $lt: new Date() } },
          { subscription: null },
        ],
      },
      {
        $set: { subscriptionCancelled: false },
      }
    );

    return {
      acknowledged: result.acknowledged,
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      upsertedCount: result.upsertedCount,
      upsertedId: result.upsertedId,
    };
  }
  // updated
  async updateUserPaymentSession(
    userId: string,
    sessionId: string,
    expiresAt: Date
  ): Promise<void> {
    await this.model.findByIdAndUpdate(userId, {
      activePaymentSession: sessionId,
      activePaymentSessionExpiresAt: expiresAt,
    });
  }
  async updateUserSubscription(
    userId: string,
    subscriptionData: Partial<IUser>,
    unsetFields?: Record<string, 1>
  ): Promise<void> {
    const update: any = { ...subscriptionData }; // MongoDB update object
    if (unsetFields) update.$unset = unsetFields;
    await this.model.findByIdAndUpdate(userId, update);
  }
  async updateSubscription(
    userId: string,
    update: Partial<IUser>
  ): Promise<void> {
    await this.model.findByIdAndUpdate(userId, update);
  }
}
