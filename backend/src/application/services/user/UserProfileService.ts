import { inject, injectable } from "inversify";
import { IUserRepository } from "../../../core/interfaces/repositories/IUserRepository";
import { TYPES } from "../../../di/types";
import { IUser } from "../../../infrastructure/database/models/user.modal";
import { IUserEducation } from "../../../infrastructure/database/models/userEducation.model";
import { IUserExperience } from "../../../infrastructure/database/models/userExperience.model";
import { IUserProject } from "../../../infrastructure/database/models/userProject.model";
import { IUserCertificate } from "../../../infrastructure/database/models/userCertificate.model";
import { IUserProfileService } from "../../../core/interfaces/services/IUserProfileService";

@injectable()
export class UserProfileService implements IUserProfileService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository
  ) {}
  async getUserProfile(userId: string): Promise<IUser> {
    const user = await this.userRepository.getUserProfile(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserProfileWithDetails(userId: string): Promise<IUser> {
    const user = await this.userRepository.getUserProfileWithDetails(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUserProfile(userId: string, data: Partial<IUser>) {
    const updated = await this.userRepository.updateUserProfile(userId, data);
    if (!updated) {
      throw new Error("User profile update failed");
    }
    return updated;
  }

  // Profile image management
  async updateProfileImage(userId: string, imageUrl: string) {
    const updateImg = await this.userRepository.updateProfileImage(
      userId,
      imageUrl
    );
    if (!updateImg) {
      throw new Error("Failed to update profile image");
    }
    return updateImg;
  }

  async deleteProfileImage(userId: string): Promise<boolean> {
    const deleted = await this.userRepository.deleteProfileImage(userId);
    if (!deleted) {
      throw new Error("Failed to delete profile image");
    }
    return deleted;
  }

  // Education
  async addEducation(
    userId: string,
    education: IUserEducation
  ): Promise<IUserEducation> {
    return await this.userRepository.addEducation(userId, education);
  }

  async editEducation(
    educationId: string,
    data: Partial<IUserEducation>
  ): Promise<IUserEducation> {
    const updated = await this.userRepository.updateEducation(
      educationId,
      data
    );
    if (!updated) {
      throw new Error("Failed to update education");
    }
    return updated;
  }

  async deleteEducation(userId: string, educationId: string): Promise<boolean> {
    const deleted = await this.userRepository.deleteEducation(
      userId,
      educationId
    );
    if (!deleted) {
      throw new Error("Failed to delete education");
    }
    return deleted;
  }

  // Experience
  async addExperience(
    userId: string,
    experience: IUserExperience
  ): Promise<IUserExperience> {
    return await this.userRepository.addExperience(userId, experience);
  }

  async editExperience(
    experienceId: string,
    data: Partial<IUserExperience>
  ): Promise<IUserExperience> {
    const updated = await this.userRepository.updateExperience(
      experienceId,
      data
    );
    if (!updated) {
      throw new Error("Failed to update experience");
    }
    return updated;
  }

  async deleteExperience(
    userId: string,
    experienceId: string
  ): Promise<boolean> {
    const deleted = await this.userRepository.deleteExperience(
      userId,
      experienceId
    );
    if (!deleted) {
      throw new Error("Failed to delete experience");
    }
    return deleted;
  }

  // Projects
  async addProject(
    userId: string,
    project: IUserProject
  ): Promise<IUserProject> {
    return await this.userRepository.addProject(userId, project);
  }

  async editProject(
    projectId: string,
    data: Partial<IUserProject>
  ): Promise<IUserProject> {
    const updated = await this.userRepository.updateProject(projectId, data);
    if (!updated) {
      throw new Error("Failed to update project");
    }
    return updated;
  }

  async deleteProject(userId: string, projectId: string): Promise<boolean> {
    const deleted = await this.userRepository.deleteProject(userId, projectId);
    if (!deleted) {
      throw new Error("Failed to delete project");
    }
    return deleted;
  }

  // Certificates
  async addCertificate(
    userId: string,
    certificate: IUserCertificate
  ): Promise<IUserCertificate> {
    return await this.userRepository.addCertificate(userId, certificate);
  }

  async editCertificate(
    certificateId: string,
    data: Partial<IUserCertificate>
  ): Promise<IUserCertificate> {
    const updated = await this.userRepository.updateCertificate(
      certificateId,
      data
    );
    if (!updated) {
      throw new Error("Failed to update certificate");
    }
    return updated;
  }

  async deleteCertificate(
    userId: string,
    certificateId: string
  ): Promise<boolean> {
    const deleted = await this.userRepository.deleteCertificate(
      userId,
      certificateId
    );
    if (!deleted) {
      throw new Error("Failed to delete certificate");
    }
    return deleted;
  }
  // Education
  async getAllEducations(userId: string): Promise<IUserEducation[]> {
    return await this.userRepository.getAllEducations(userId);
  }

  // Experience
  async getAllExperiences(userId: string): Promise<IUserExperience[]> {
    return await this.userRepository.getAllExperiences(userId);
  }

  // Projects
  async getAllProjects(userId: string): Promise<IUserProject[]> {
    return await this.userRepository.getAllProjects(userId);
  }

  // Certificates
  async getAllCertificates(userId: string): Promise<IUserCertificate[]> {
    return await this.userRepository.getAllCertificates(userId);
  }
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    if (newPassword !== confirmPassword) {
      throw new Error("New password and confirm password must match");
    }
    await this.userRepository.changePassword(
      userId,
      currentPassword,
      newPassword
    );
  }
}
