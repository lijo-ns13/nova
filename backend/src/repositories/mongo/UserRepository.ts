import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import userModal, { IUser } from "../../models/user.modal";
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
  constructor(@inject(TYPES.UserModal) userModal: Model<IUser>) {
    super(userModal);
  }
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return this.create(userData); // calls BaseRepository.create()
  }
  async updateUser(
    userId: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    return this.update(userId, updateData);
  }

  async findByEmail(email: string, isPassword = false): Promise<IUser | null> {
    const query = userModal.findOne({ email });
    return isPassword ? query.select("+password") : query;
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await userModal.findByIdAndUpdate(userId, { password: newPassword });
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return userModal.findOne({ googleId });
  }

  async addToAppliedJobs(userId: string, jobId: string): Promise<void> {
    await userModal.findByIdAndUpdate(userId, {
      $addToSet: { appliedJobs: jobId },
    });
  }

  async addToSavedJobs(userId: string, jobId: string): Promise<void> {
    await userModal.findByIdAndUpdate(userId, {
      $addToSet: { savedJobs: jobId },
    });
  }

  async removeFromSavedJobs(userId: string, jobId: string): Promise<void> {
    await userModal.findByIdAndUpdate(userId, {
      $pull: { savedJobs: jobId },
    });
  }

  async getSavedJobs(
    userId: string
  ): Promise<(IUser & { savedJobs: IJob[] }) | null> {
    const user = await userModal.findById(userId).populate("savedJobs").lean(); // <- this converts the final result to a plain object

    return user as (IUser & { savedJobs: IJob[] }) | null;
  }

  async getAppliedJobs(
    userId: string
  ): Promise<(IUser & { appliedJobs: IJob[] }) | null> {
    const user = await userModal
      .findById(userId)
      .populate("appliedJobs")
      .lean(); // <- this converts the final result to a plain object

    return user as (IUser & { appliedJobs: IJob[] }) | null;
  }

  // user profile realted
  //  Get User Profile
  async getUserProfile(userId: string): Promise<IUser | null> {
    return await userModal.findById(userId);
  }
  // get user profiole with details
  async getUserProfileWithDetails(userId: string): Promise<IUser | null> {
    return userModal
      .findById(userId)
      .populate("educations")
      .populate("experiences")
      .populate("projects")
      .populate("certificates");
  }
  //  Update User Profile
  async updateUserProfile(
    userId: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    return await userModal.findByIdAndUpdate(userId, data, { new: true });
  }

  // Update Profile Image
  async updateProfileImage(
    userId: string,
    imageUrl: string
  ): Promise<IUser | null> {
    return await userModal.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrl },
      { new: true }
    );
  }

  //  Delete Profile Image
  async deleteProfileImage(userId: string): Promise<boolean> {
    return (
      (await userModal.findByIdAndUpdate(userId, { profilePicture: null })) !==
      null
    );
  }

  //  Add Education
  async addEducation(
    userId: string,
    education: IUserEducation
  ): Promise<IUserEducation> {
    try {
      const newEducation = new userEducationModel({ ...education, userId });
      const savedEducation = await newEducation.save();

      await userModal.findByIdAndUpdate(
        userId,
        { $push: { educations: savedEducation._id } },
        { new: true }
      );

      return savedEducation;
    } catch (error) {
      console.log("error occured", error);
      throw error;
    }
  }

  // Update Education
  async updateEducation(
    educationId: string,
    data: Partial<IUserEducation>
  ): Promise<IUserEducation | null> {
    return await userEducationModel.findByIdAndUpdate(educationId, data, {
      new: true,
    });
  }

  //  Delete Education
  async deleteEducation(userId: string, educationId: string): Promise<boolean> {
    try {
      const deletedEducation = await userEducationModel.findByIdAndDelete(
        educationId
      );
      if (!deletedEducation) {
        throw new Error("Education not found");
      }
      await userModal.findByIdAndUpdate(userId, {
        $pull: { educations: educationId },
      });

      return true;
    } catch (error) {
      console.log("error in delete education", error);
      return false;
    }
  }

  //  Add Experience
  async addExperience(
    userId: string,
    experience: IUserExperience
  ): Promise<IUserExperience> {
    try {
      const newExperience = new userExperienceModel({ ...experience, userId });
      const savedExperience = await newExperience.save();

      await userModal.findByIdAndUpdate(
        userId,
        { $push: { experiences: savedExperience._id } },
        { new: true }
      );

      return savedExperience;
    } catch (error) {
      console.log("error occured in add experinced", error);
      throw error;
    }
  }

  //  Update Experience
  async updateExperience(
    experienceId: string,
    data: Partial<IUserExperience>
  ): Promise<IUserExperience | null> {
    return await userExperienceModel.findByIdAndUpdate(experienceId, data, {
      new: true,
    });
  }

  //  Delete Experience
  async deleteExperience(
    userId: string,
    experienceId: string
  ): Promise<boolean> {
    try {
      const deletedExperience = await userExperienceModel.findByIdAndDelete(
        experienceId
      );
      if (!deletedExperience) {
        throw new Error("not found experience");
      }
      await userModal.findByIdAndUpdate(userId, {
        $pull: { experiences: experienceId },
      });

      return true;
    } catch (error) {
      console.log("error in deleted expernce", error);
      return false;
    }
  }

  //  Add Project
  async addProject(
    userId: string,
    project: IUserProject
  ): Promise<IUserProject> {
    try {
      const newProject = new userProjectModel({ ...project, userId });
      const savedProject = await newProject.save();

      await userModal.findByIdAndUpdate(
        userId,
        { $push: { projects: savedProject._id } },
        { new: true }
      );

      return savedProject;
    } catch (error) {
      console.log("error in add project", error);
      throw error;
    }
  }

  //  Update Project
  async updateProject(
    projectId: string,
    data: Partial<IUserProject>
  ): Promise<IUserProject | null> {
    return await userProjectModel.findByIdAndUpdate(projectId, data, {
      new: true,
    });
  }

  //  Delete Project
  async deleteProject(userId: string, projectId: string): Promise<boolean> {
    try {
      const deletedProject = await userProjectModel.findByIdAndDelete(
        projectId
      );
      if (!deletedProject) {
        throw new Error("no projects found");
      }
      await userModal.findByIdAndUpdate(userId, {
        $pull: { projects: projectId },
      });

      return true;
    } catch (error) {
      console.log("error in delete projects", error);
      return false;
    }
  }

  //  Add Certificate
  async addCertificate(
    userId: string,
    certificate: IUserCertificate
  ): Promise<IUserCertificate> {
    try {
      const newCertificate = new userCertificateModel({
        ...certificate,
        userId,
      });
      const savedCertificate = await newCertificate.save();

      await userModal.findByIdAndUpdate(
        userId,
        { $push: { certifications: savedCertificate._id } },
        { new: true }
      );

      return savedCertificate;
    } catch (error) {
      console.log("error in add certificates", error);
      throw error;
    }
  }

  //  Update Certificate
  async updateCertificate(
    certificateId: string,
    data: Partial<IUserCertificate>
  ): Promise<IUserCertificate | null> {
    return await userCertificateModel.findByIdAndUpdate(certificateId, data, {
      new: true,
    });
  }

  //  Delete Certificate
  async deleteCertificate(
    userId: string,
    certificateId: string
  ): Promise<boolean> {
    try {
      const deletedCertificates = await userCertificateModel.findByIdAndDelete(
        certificateId
      );
      if (!deletedCertificates) {
        throw new Error("certificates not found");
      }
      await userModal.findByIdAndUpdate(userId, {
        $pull: { certifications: certificateId },
      });

      return true;
    } catch (error) {
      console.log("erro in delete certificates", error);
      return false;
    }
  }
  // Get all educations for a user
  async getAllEducations(userId: string): Promise<IUserEducation[]> {
    return await userEducationModel.find({ userId });
  }

  // Get all experiences for a user
  async getAllExperiences(userId: string): Promise<IUserExperience[]> {
    return await userExperienceModel.find({ userId });
  }

  // Get all projects for a user
  async getAllProjects(userId: string): Promise<IUserProject[]> {
    return await userProjectModel.find({ userId });
  }

  // Get all certificates for a user
  async getAllCertificates(userId: string): Promise<IUserCertificate[]> {
    return await userCertificateModel.find({ userId });
  }
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const user = await userModal.findById(userId).select("+password");
    if (!user) throw new Error("User not found");
    if (!user.password)
      throw new Error("google users cant change there password");
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("Current password is incorrect");

    user.password = newPassword;
    await user.save();
    return true;
  }
  // user repositories
  // admin serach users
  async findUsers(page: number, limit: number, searchQuery?: string) {
    const skip = (page - 1) * limit;
    let query = {};

    if (searchQuery && searchQuery.trim()) {
      const regex = new RegExp(searchQuery, "i");
      query = {
        $or: [{ name: regex }, { email: regex }],
      };
    }

    const users = await userModal
      .find(query)
      .skip(skip)
      .limit(limit)
      .select("-password") // Exclude password field
      .exec();

    const totalUsers = await userModal.countDocuments(query);

    return { users, totalUsers };
  }
  // search
  async searchUsers(query: string, limit = 10): Promise<IUser[]> {
    const regex = new RegExp(`^${query}`, "i"); // ^ anchors to start of string
    const users = await userModal.find({ name: regex }).limit(limit);
    return users;
  }
  async isUsernameTaken(
    username: string,
    excludeUserId?: string
  ): Promise<boolean> {
    const existingUser = await userModal.findOne({
      username,
      _id: { $ne: excludeUserId }, // exclude the current user
    });
    return !!existingUser;
  }
  async getUserSkillsById(userId: string): Promise<ISkill[] | undefined> {
    const user = await userModal.findById(userId).populate("skills");
    return user?.skills as ISkill[] | undefined;
  }

  async addSkillsToUser(
    userId: string,
    skillIds: Types.ObjectId[]
  ): Promise<IUser | null> {
    return await userModal
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
    return await userModal
      .findByIdAndUpdate(
        userId,
        { $pull: { skills: new Types.ObjectId(skillId) } },
        { new: true }
      )
      .populate("skills");
  }
  // follow realted- userrepo>

  async followUser(
    followerId: string,
    followingId: string
  ): Promise<{ follower: IUser | null; following: IUser | null }> {
    // Add followingId to the follower's following list
    const follower = await this.model.findByIdAndUpdate(
      followerId,
      { $addToSet: { following: new Types.ObjectId(followingId) } },
      { new: true }
    );

    // Add followerId to the following user's followers list
    const following = await this.model.findByIdAndUpdate(
      followingId,
      { $addToSet: { followers: new Types.ObjectId(followerId) } },
      { new: true }
    );

    return { follower, following };
  }

  async unfollowUser(
    followerId: string,
    followingId: string
  ): Promise<{ follower: IUser | null; following: IUser | null }> {
    // Remove followingId from the follower's following list
    const follower = await this.model.findByIdAndUpdate(
      followerId,
      { $pull: { following: new Types.ObjectId(followingId) } },
      { new: true }
    );

    // Remove followerId from the following user's followers list
    const following = await this.model.findByIdAndUpdate(
      followingId,
      { $pull: { followers: new Types.ObjectId(followerId) } },
      { new: true }
    );
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
