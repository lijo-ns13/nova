import { APIResponse } from "../../../types/api";
import { handleApiError } from "../../../utils/apiError";
import userAxios from "../../../utils/userAxios";
import { CertificateResponseDTO } from "../dto/certificateResponse.dto";
import { EducationResponseDTO } from "../dto/educationResponse.dto";
import { ExperienceResponseDTO } from "../dto/experienceResponse.dto";
import { ProjectResponseDTO } from "../dto/projectResponse.dto";
import {
  CreateCertificateInputDTO,
  UpdateCertificateInputDTO,
} from "../schema/certificateSchema";
import {
  CreateEducationInputDTO,
  UpdateEducationInputDTO,
} from "../schema/educationSchema";
import {
  CreateExperienceInputDTO,
  UpdateExperienceInputDTO,
} from "../schema/experienceSchema";
import {
  CreateProjectInputDTO,
  UpdateProjectInputDTO,
} from "../schema/projectSchema";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_BASE_URL = `${BASE_URL}/user-profile`;

// User Profile
export const getUserProfile = async (userId: string) => {
  const response = await userAxios.get(`${API_BASE_URL}/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId: string, data: any) => {
  const response = await userAxios.patch(`${API_BASE_URL}/${userId}`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const updateProfileImage = async (userId: string, imageUrl: string) => {
  const response = await userAxios.put(
    `${API_BASE_URL}/${userId}/profile-image`,
    { imageUrl },
    { withCredentials: true }
  );
  return response.data;
};

export const deleteProfileImage = async (userId: string): Promise<void> => {
  await userAxios.delete(`${API_BASE_URL}/${userId}/profile-image`, {
    withCredentials: true,
  });
};

// Education
export const addEducation = async (
  userId: string,
  input: CreateEducationInputDTO
): Promise<EducationResponseDTO> => {
  try {
    const response = await userAxios.post<APIResponse<EducationResponseDTO>>(
      `${API_BASE_URL}/${userId}/education`,
      input,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to add education");
  }
};

export const editEducation = async (
  userId: string,
  educationId: string,
  data: UpdateEducationInputDTO
): Promise<EducationResponseDTO> => {
  try {
    const response = await userAxios.patch<APIResponse<EducationResponseDTO>>(
      `${API_BASE_URL}/${userId}/education/${educationId}`,
      data,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to edit education");
  }
};

export const deleteEducation = async (
  userId: string,
  educationId: string
): Promise<boolean> => {
  try {
    const response = await userAxios.delete<APIResponse<boolean>>(
      `${API_BASE_URL}/${userId}/education/${educationId}`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to delete education");
  }
};
export const getEducations = async (
  userId: string
): Promise<EducationResponseDTO[]> => {
  try {
    const res = await userAxios.get<APIResponse<EducationResponseDTO[]>>(
      `${API_BASE_URL}/${userId}/educations`
    );
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to get educations");
  }
};

// Experience
export const addExperience = async (
  userId: string,
  experience: CreateExperienceInputDTO
): Promise<ExperienceResponseDTO> => {
  try {
    const response = await userAxios.post<APIResponse<ExperienceResponseDTO>>(
      `${API_BASE_URL}/${userId}/experience`,
      experience,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to add exp");
  }
};

export const editExperience = async (
  userId: string,
  experienceId: string,
  data: UpdateExperienceInputDTO
): Promise<ExperienceResponseDTO> => {
  try {
    const response = await userAxios.patch<APIResponse<ExperienceResponseDTO>>(
      `${API_BASE_URL}/${userId}/experience/${experienceId}`,
      data,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to edit education");
  }
};

export const deleteExperience = async (
  userId: string,
  experienceId: string
): Promise<boolean> => {
  try {
    const res = await userAxios.delete<APIResponse<boolean>>(
      `${API_BASE_URL}/${userId}/experience/${experienceId}`,
      { withCredentials: true }
    );
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to delete exp");
  }
};
export const getExperience = async (
  userId: string
): Promise<ExperienceResponseDTO[]> => {
  try {
    const res = await userAxios.get<APIResponse<ExperienceResponseDTO[]>>(
      `${API_BASE_URL}/${userId}/experiences`
    );
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to get exp");
  }
};
// Projects
export const addProject = async (
  userId: string,
  project: CreateProjectInputDTO
): Promise<ProjectResponseDTO> => {
  try {
    const response = await userAxios.post<APIResponse<ProjectResponseDTO>>(
      `${API_BASE_URL}/${userId}/project`,
      project,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to add project");
  }
};

export const editProject = async (
  userId: string,
  projectId: string,
  data: UpdateProjectInputDTO
): Promise<ProjectResponseDTO> => {
  try {
    const response = await userAxios.patch<APIResponse<ProjectResponseDTO>>(
      `${API_BASE_URL}/${userId}/project/${projectId}`,
      data,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to edit proejct");
  }
};

export const deleteProject = async (
  userId: string,
  projectId: string
): Promise<boolean> => {
  try {
    const res = await userAxios.delete<APIResponse<boolean>>(
      `${API_BASE_URL}/${userId}/project/${projectId}`,
      {
        withCredentials: true,
      }
    );
    return res.data.data;
  } catch (error) {
    handleApiError(error, "failed to delte project");
  }
};
export const getProjects = async (
  userId: string
): Promise<ProjectResponseDTO[]> => {
  try {
    const res = await userAxios.get<APIResponse<ProjectResponseDTO[]>>(
      `${API_BASE_URL}/${userId}/projects`
    );
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to get projects");
  }
};
// Certificates
export const addCertificate = async (
  userId: string,
  certificate: CreateCertificateInputDTO
): Promise<CertificateResponseDTO> => {
  try {
    const response = await userAxios.post<APIResponse<CertificateResponseDTO>>(
      `${API_BASE_URL}/${userId}/certificate`,
      certificate,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to add cert");
  }
};

export const editCertificate = async (
  userId: string,
  certificateId: string,
  data: UpdateCertificateInputDTO
): Promise<CertificateResponseDTO> => {
  try {
    const response = await userAxios.patch<APIResponse<CertificateResponseDTO>>(
      `${API_BASE_URL}/${userId}/certificate/${certificateId}`,
      data,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to edit certificates");
  }
};

export const deleteCertificate = async (
  userId: string,
  certificateId: string
): Promise<boolean> => {
  try {
    const res = await userAxios.delete<APIResponse<boolean>>(
      `${API_BASE_URL}/${userId}/certificate/${certificateId}`,
      { withCredentials: true }
    );
    return res.data.data;
  } catch (error) {
    handleApiError(error, "failed to delete cert");
  }
};

export const getCertificates = async (
  userId: string
): Promise<CertificateResponseDTO[]> => {
  try {
    const res = await userAxios.get<APIResponse<CertificateResponseDTO[]>>(
      `${API_BASE_URL}/${userId}/certificates`
    );
    return res.data.data;
  } catch (error) {
    handleApiError(error, "failed to get certificates");
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<boolean> => {
  try {
    const response = await userAxios.patch<APIResponse<boolean>>(
      `${API_BASE_URL}/change-password`,
      { currentPassword, newPassword, confirmPassword },
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "failed to change password");
  }
};

// profile view api

export const getBasicUserData = async (username: string) => {
  const res = await userAxios.get(`${BASE_URL}/api/users/${username}`);
  return res.data;
};
export const getUserPostData = async (username: string) => {
  const res = await userAxios.get(`${BASE_URL}/post/${username}`);
  return res.data;
};
