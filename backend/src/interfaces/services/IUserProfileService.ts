// src/core/interfaces/services/IUserProfileService.ts

import { IUser } from "../../models/user.modal";
import { IUserEducation } from "../../models/userEducation.model";
import { IUserExperience } from "../../models/userExperience.model";
import { IUserProject } from "../../models/userProject.model";
import { IUserCertificate } from "../../models/userCertificate.model";
import { UpdateUserProfileInputDTO } from "../../core/dtos/user/userprofile";
import { GetUserProfileResponseDTO } from "../../mapping/user/userprofile.mapper";
import {
  CreateEducationInputDTO,
  EducationResponseDTO,
} from "../../core/dtos/user/UserEducation.dto";
import {
  CreateExperienceInputDTO,
  ExperienceResponseDTO,
} from "../../core/dtos/user/userExperience";
import {
  CreateProjectInputDTO,
  ProjectResponseDTO,
} from "../../core/dtos/user/userproject";
import {
  CertificateResponseDTO,
  CreateCertificateInputDTO,
} from "../../core/dtos/user/certificate.dto";

export interface IUserProfileService {
  getUserProfile(userId: string): Promise<GetUserProfileResponseDTO>;

  updateUserProfile(
    userId: string,
    data: UpdateUserProfileInputDTO
  ): Promise<GetUserProfileResponseDTO>;

  updateProfileImage(
    userId: string,
    imageUrl: string
  ): Promise<GetUserProfileResponseDTO>;

  deleteProfileImage(userId: string): Promise<void>;
  // Add education
  addEducation(
    userId: string,
    input: CreateEducationInputDTO
  ): Promise<EducationResponseDTO>;

  // Edit education
  editEducation(
    educationId: string,
    data: Partial<CreateEducationInputDTO>
  ): Promise<EducationResponseDTO>;

  // Delete education
  deleteEducation(userId: string, educationId: string): Promise<void>;

  // Get all educations for a user
  getAllEducations(userId: string): Promise<EducationResponseDTO[]>;

  addExperience(
    userId: string,
    experience: CreateExperienceInputDTO
  ): Promise<ExperienceResponseDTO>;

  editExperience(
    experienceId: string,
    data: Partial<CreateExperienceInputDTO>
  ): Promise<ExperienceResponseDTO>;

  deleteExperience(userId: string, experienceId: string): Promise<boolean>;

  getAllExperiences(userId: string): Promise<ExperienceResponseDTO[]>;
  addProject(
    userId: string,
    project: CreateProjectInputDTO
  ): Promise<ProjectResponseDTO>;
  editProject(
    projectId: string,
    data: Partial<CreateProjectInputDTO>
  ): Promise<ProjectResponseDTO>;
  deleteProject(userId: string, projectId: string): Promise<boolean>;
  getAllProjects(userId: string): Promise<ProjectResponseDTO[]>;
  // Certificates
  addCertificate(
    userId: string,
    certificate: CreateCertificateInputDTO
  ): Promise<CertificateResponseDTO>;
  editCertificate(
    certificateId: string,
    data: Partial<CreateCertificateInputDTO>
  ): Promise<CertificateResponseDTO>;
  deleteCertificate(userId: string, certificateId: string): Promise<boolean>;
  getAllCertificates(userId: string): Promise<CertificateResponseDTO[]>;

  // Password
  changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void>;
}
