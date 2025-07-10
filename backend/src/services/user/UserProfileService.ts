import { inject, injectable } from "inversify";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { TYPES } from "../../di/types";
import { IUser } from "../../models/user.modal";
import { IUserEducation } from "../../models/userEducation.model";
import { IUserExperience } from "../../models/userExperience.model";
import { IUserProject } from "../../models/userProject.model";
import { IUserCertificate } from "../../models/userCertificate.model";
import { IUserProfileService } from "../../interfaces/services/IUserProfileService";
import { UpdateUserProfileInputDTO } from "../../core/dtos/user/userprofile";
import {
  GetUserProfileResponseDTO,
  UserProfileMapper,
} from "../../mapping/user/userprofile.mapper";
import { EducationMapper } from "../../mapping/user/education.mapper";
import {
  CreateEducationInputDTO,
  EducationResponseDTO,
} from "../../core/dtos/user/UserEducation.dto";
import {
  CreateExperienceInputDTO,
  ExperienceResponseDTO,
} from "../../core/dtos/user/userExperience";
import { ExperienceMapper } from "../../mapping/user/experience.mapper";
import {
  CreateProjectInputDTO,
  ProjectResponseDTO,
} from "../../core/dtos/user/userproject";
import { ProjectMapper } from "../../mapping/user/projectmapper";
import { JobMapper } from "../../mapping/job.mapper";
import {
  CertificateResponseDTO,
  CreateCertificateInputDTO,
} from "../../core/dtos/user/certificate.dto";
import { CertificateMapper } from "../../mapping/user/certificate.mapper";

@injectable()
export class UserProfileService implements IUserProfileService {
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository
  ) {}
  async getUserProfile(userId: string): Promise<GetUserProfileResponseDTO> {
    const user = await this._userRepository.getUserProfile(userId);
    if (!user) throw new Error("User not found");
    return UserProfileMapper.toProfileDTO(user);
  }

  async updateUserProfile(
    userId: string,
    data: UpdateUserProfileInputDTO
  ): Promise<GetUserProfileResponseDTO> {
    if (data.username) {
      const newUsername = data.username.trim().toLowerCase();

      const isTaken = await this._userRepository.isUsernameTaken(
        newUsername,
        userId
      );
      if (isTaken) {
        throw new Error("Username already exists, try another one.");
      }

      data.username = newUsername;
    }

    const updatedUser = await this._userRepository.updateUserProfile(
      userId,
      data
    );
    if (!updatedUser) throw new Error("User update failed");
    return UserProfileMapper.toProfileDTO(updatedUser);
  }

  async updateProfileImage(userId: string, imageUrl: string) {
    const updated = await this._userRepository.updateProfileImage(
      userId,
      imageUrl
    );
    if (!updated) throw new Error("Failed to update profile image");
    return UserProfileMapper.toProfileDTO(updated);
  }

  async deleteProfileImage(userId: string): Promise<void> {
    const deleted = await this._userRepository.deleteProfileImage(userId);
    if (!deleted) throw new Error("Failed to delete profile image");
  }

  async addEducation(
    userId: string,
    input: CreateEducationInputDTO
  ): Promise<EducationResponseDTO> {
    const created = await this._userRepository.addEducation(userId, input);
    return EducationMapper.toDTO(created);
  }

  async editEducation(
    educationId: string,
    data: Partial<CreateEducationInputDTO>
  ): Promise<EducationResponseDTO> {
    const updated = await this._userRepository.updateEducation(
      educationId,
      data
    );
    if (!updated) throw new Error("Failed to update education");
    return EducationMapper.toDTO(updated);
  }

  async deleteEducation(userId: string, educationId: string): Promise<void> {
    const deleted = await this._userRepository.deleteEducation(
      userId,
      educationId
    );
    if (!deleted) throw new Error("Failed to delete education");
  }

  async getAllEducations(userId: string): Promise<EducationResponseDTO[]> {
    const educations = await this._userRepository.getAllEducations(userId);
    return educations.map(EducationMapper.toDTO);
  }
  // Experience
  async addExperience(
    userId: string,
    experience: CreateExperienceInputDTO
  ): Promise<ExperienceResponseDTO> {
    const exp = await this._userRepository.addExperience(userId, experience);
    return ExperienceMapper.toDTO(exp);
  }

  async editExperience(
    experienceId: string,
    data: Partial<CreateExperienceInputDTO>
  ): Promise<ExperienceResponseDTO> {
    const updated = await this._userRepository.updateExperience(
      experienceId,
      data
    );
    if (!updated) {
      throw new Error("Failed to update experience");
    }
    return ExperienceMapper.toDTO(updated);
  }

  async deleteExperience(
    userId: string,
    experienceId: string
  ): Promise<boolean> {
    const deleted = await this._userRepository.deleteExperience(
      userId,
      experienceId
    );
    if (!deleted) {
      throw new Error("Failed to delete experience");
    }
    return deleted;
  }
  // Experience
  async getAllExperiences(userId: string): Promise<ExperienceResponseDTO[]> {
    const exps = await this._userRepository.getAllExperiences(userId);
    return exps.map(ExperienceMapper.toDTO);
  }
  // Projects
  async addProject(
    userId: string,
    project: CreateProjectInputDTO
  ): Promise<ProjectResponseDTO> {
    const data = await this._userRepository.addProject(userId, project);
    return ProjectMapper.toDTO(data);
  }

  async editProject(
    projectId: string,
    data: Partial<CreateProjectInputDTO>
  ): Promise<ProjectResponseDTO> {
    const updated = await this._userRepository.updateProject(projectId, data);
    if (!updated) {
      throw new Error("Failed to update project");
    }
    return ProjectMapper.toDTO(updated);
  }

  async deleteProject(userId: string, projectId: string): Promise<boolean> {
    const deleted = await this._userRepository.deleteProject(userId, projectId);
    if (!deleted) {
      throw new Error("Failed to delete project");
    }
    return deleted;
  }
  // Projects
  async getAllProjects(userId: string): Promise<ProjectResponseDTO[]> {
    const projects = await this._userRepository.getAllProjects(userId);
    return projects.map(ProjectMapper.toDTO);
  }

  // Certificates
  async addCertificate(
    userId: string,
    certificate: CreateCertificateInputDTO
  ): Promise<CertificateResponseDTO> {
    const cert = await this._userRepository.addCertificate(userId, certificate);
    return CertificateMapper.toDTO(cert);
  }

  async editCertificate(
    certificateId: string,
    data: Partial<CreateCertificateInputDTO>
  ): Promise<CertificateResponseDTO> {
    const updated = await this._userRepository.updateCertificate(
      certificateId,
      data
    );
    if (!updated) {
      throw new Error("Failed to update certificate");
    }
    return CertificateMapper.toDTO(updated);
  }

  async deleteCertificate(
    userId: string,
    certificateId: string
  ): Promise<boolean> {
    const deleted = await this._userRepository.deleteCertificate(
      userId,
      certificateId
    );
    if (!deleted) {
      throw new Error("Failed to delete certificate");
    }
    return deleted;
  }

  // Certificates
  async getAllCertificates(userId: string): Promise<CertificateResponseDTO[]> {
    const certs = await this._userRepository.getAllCertificates(userId);
    return certs.map(CertificateMapper.toDTO);
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

    await this._userRepository.changePassword(
      userId,
      currentPassword,
      newPassword
    );
  }
}
