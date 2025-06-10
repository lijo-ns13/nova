import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUser } from "../../models/user.modal";
import { BaseRepository } from "./BaseRepository";
import { TYPES } from "../../di/types";
import bcrypt from "bcrypt";
import userCertificateModel, {
  IUserCertificate,
} from "../../models/userCertificate.model";
import userProjectModel, { IUserProject } from "../../models/userProject.model";
import userExperienceModel, {
  IUserExperience,
} from "../../models/userExperience.model";
import userEducationModel, {
  IUserEducation,
} from "../../models/userEducation.model";
import { IJob } from "../../models/job.modal";
import { ISkill } from "../../models/skill.modal";

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor(@inject(TYPES.UserModal) private userModel: Model<IUser>) {
    super(userModel);
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
    if (!user) throw new Error("User not found");
    if (!user.password)
      throw new Error("Google users can't change their password");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("Current password is incorrect");

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

  // Profile Related Methods
  async getUserProfile(userId: string): Promise<IUser | null> {
    return this.findById(userId);
  }

  async getUserProfileWithDetails(userId: string): Promise<IUser | null> {
    return this.model
      .findById(userId)
      .populate("educations")
      .populate("experiences")
      .populate("projects")
      .populate("certificates");
  }

  async updateProfileImage(
    userId: string,
    imageUrl: string
  ): Promise<IUser | null> {
    return this.update(userId, { profilePicture: imageUrl });
  }
  async updateUserProfile(
    userId: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    return this.findOneAndUpdate({ _id: userId }, data);
  }
  async deleteProfileImage(userId: string): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(userId, {
      profilePicture: null,
    });
    return result !== null;
  }

  // Education Methods
  async addEducation(
    userId: string,
    education: IUserEducation
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
    data: Partial<IUserEducation>
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
    experience: IUserExperience
  ): Promise<IUserExperience> {
    const newExperience = await userExperienceModel.create({
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
    data: Partial<IUserExperience>
  ): Promise<IUserExperience | null> {
    return userExperienceModel.findByIdAndUpdate(experienceId, data, {
      new: true,
    });
  }

  async deleteExperience(
    userId: string,
    experienceId: string
  ): Promise<boolean> {
    await userExperienceModel.findByIdAndDelete(experienceId);
    await this.model.findByIdAndUpdate(userId, {
      $pull: { experiences: experienceId },
    });
    return true;
  }

  async getAllExperiences(userId: string): Promise<IUserExperience[]> {
    return userExperienceModel.find({ userId });
  }

  // Project Methods
  async addProject(
    userId: string,
    project: IUserProject
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
    data: Partial<IUserProject>
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
    certificate: IUserCertificate
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
    data: Partial<IUserCertificate>
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

  async isUsernameTaken(
    username: string,
    excludeUserId?: string
  ): Promise<boolean> {
    const existingUser = await this.model.findOne({
      username,
      _id: { $ne: excludeUserId },
    });
    return !!existingUser;
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

  async getAllUsersExcept(userId: string): Promise<IUser[]> {
    return this.model
      .find(
        { _id: { $ne: new Types.ObjectId(userId) } },
        { name: 1, username: 1, profilePicture: 1, headline: 1 }
      )
      .lean();
  }
}
