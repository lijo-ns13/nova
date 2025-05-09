// src/core/interfaces/services/IUserProfileService.ts

import { IUser } from "../../models/user.modal";
import { IUserEducation } from "../../models/userEducation.model";
import { IUserExperience } from "../../models/userExperience.model";
import { IUserProject } from "../../models/userProject.model";
import { IUserCertificate } from "../../models/userCertificate.model";

export interface IUserProfileService {
  getUserProfile(userId: string): Promise<IUser>;
  getUserProfileWithDetails(userId: string): Promise<IUser>;
  updateUserProfile(userId: string, data: Partial<IUser>): Promise<IUser>;

  updateProfileImage(userId: string, imageUrl: string): Promise<IUser>;
  deleteProfileImage(userId: string): Promise<boolean>;

  // Education
  addEducation(
    userId: string,
    education: IUserEducation
  ): Promise<IUserEducation>;
  editEducation(
    educationId: string,
    data: Partial<IUserEducation>
  ): Promise<IUserEducation>;
  deleteEducation(userId: string, educationId: string): Promise<boolean>;
  getAllEducations(userId: string): Promise<IUserEducation[]>;

  // Experience
  addExperience(
    userId: string,
    experience: IUserExperience
  ): Promise<IUserExperience>;
  editExperience(
    experienceId: string,
    data: Partial<IUserExperience>
  ): Promise<IUserExperience>;
  deleteExperience(userId: string, experienceId: string): Promise<boolean>;
  getAllExperiences(userId: string): Promise<IUserExperience[]>;

  // Projects
  addProject(userId: string, project: IUserProject): Promise<IUserProject>;
  editProject(
    projectId: string,
    data: Partial<IUserProject>
  ): Promise<IUserProject>;
  deleteProject(userId: string, projectId: string): Promise<boolean>;
  getAllProjects(userId: string): Promise<IUserProject[]>;

  // Certificates
  addCertificate(
    userId: string,
    certificate: IUserCertificate
  ): Promise<IUserCertificate>;
  editCertificate(
    certificateId: string,
    data: Partial<IUserCertificate>
  ): Promise<IUserCertificate>;
  deleteCertificate(userId: string, certificateId: string): Promise<boolean>;
  getAllCertificates(userId: string): Promise<IUserCertificate[]>;

  // Password
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void>;
}
