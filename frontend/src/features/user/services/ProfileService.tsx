import userAxios from "../../../utils/userAxios";

const API_BASE_URL = "http://localhost:3000/user-profile";
const BASE_URL = "http://localhost:3000";
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
export const addEducation = async (userId: string, education: any) => {
  const response = await userAxios.post(
    `${API_BASE_URL}/${userId}/education`,
    education,
    { withCredentials: true }
  );
  return response.data;
};

export const editEducation = async (
  userId: string,
  educationId: string,
  data: any
) => {
  const response = await userAxios.patch(
    `${API_BASE_URL}/${userId}/education/${educationId}`,
    data,
    { withCredentials: true }
  );
  return response.data;
};

export const deleteEducation = async (userId: string, educationId: string) => {
  await userAxios.delete(`${API_BASE_URL}/${userId}/education/${educationId}`, {
    withCredentials: true,
  });
};

// Experience
export const addExperience = async (userId: string, experience: any) => {
  const response = await userAxios.post(
    `${API_BASE_URL}/${userId}/experience`,
    experience,
    { withCredentials: true }
  );
  return response.data;
};

export const editExperience = async (
  userId: string,
  experienceId: string,
  data: any
) => {
  const response = await userAxios.patch(
    `${API_BASE_URL}/${userId}/experience/${experienceId}`,
    data,
    { withCredentials: true }
  );
  return response.data;
};

export const deleteExperience = async (
  userId: string,
  experienceId: string
) => {
  await userAxios.delete(
    `${API_BASE_URL}/${userId}/experience/${experienceId}`,
    { withCredentials: true }
  );
};

// Projects
export const addProject = async (userId: string, project: any) => {
  const response = await userAxios.post(
    `${API_BASE_URL}/${userId}/project`,
    project,
    { withCredentials: true }
  );
  return response.data;
};

export const editProject = async (
  userId: string,
  projectId: string,
  data: any
) => {
  const response = await userAxios.patch(
    `${API_BASE_URL}/${userId}/project/${projectId}`,
    data,
    { withCredentials: true }
  );
  return response.data;
};

export const deleteProject = async (
  userId: string,
  projectId: string
): Promise<void> => {
  await userAxios.delete(`${API_BASE_URL}/${userId}/project/${projectId}`, {
    withCredentials: true,
  });
};

// Certificates
export const addCertificate = async (userId: string, certificate: any) => {
  const response = await userAxios.post(
    `${API_BASE_URL}/${userId}/certificate`,
    certificate,
    { withCredentials: true }
  );
  return response.data;
};

export const editCertificate = async (
  userId: string,
  certificateId: string,
  data: any
) => {
  const response = await userAxios.patch(
    `${API_BASE_URL}/${userId}/certificate/${certificateId}`,
    data,
    { withCredentials: true }
  );
  return response.data;
};

export const deleteCertificate = async (
  userId: string,
  certificateId: string
): Promise<void> => {
  await userAxios.delete(
    `${API_BASE_URL}/${userId}/certificate/${certificateId}`,
    { withCredentials: true }
  );
};

export const getCertificates = async (userId: string) => {
  const res = await userAxios.get(`${API_BASE_URL}/${userId}/certificates`);
  return res.data;
};
export const getProjects = async (userId: string) => {
  const res = await userAxios.get(`${API_BASE_URL}/${userId}/projects`);
  return res.data;
};
export const getExperience = async (userId: string) => {
  const res = await userAxios.get(`${API_BASE_URL}/${userId}/experiences`);
  return res.data;
};
export const getEducations = async (userId: string) => {
  const res = await userAxios.get(`${API_BASE_URL}/${userId}/educations`);
  return res.data;
};
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const response = await userAxios.patch(
    `${API_BASE_URL}/change-password`,
    { currentPassword, newPassword, confirmPassword },
    { withCredentials: true }
  );
  return response.data;
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
