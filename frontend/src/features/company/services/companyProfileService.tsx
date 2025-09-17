import apiAxios from "../../../utils/apiAxios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_BASE_URL = `${BASE_URL}/company/profile`;

// User Profile
export const getCompanyProfile = async () => {
  const response = await apiAxios.get(`${API_BASE_URL}`);
  return response.data;
};
export const getCompanyProfileWithDetails = async () => {
  const response = await apiAxios.get(`${API_BASE_URL}/details`);
  return response.data;
};

export const updateCompanyProfile = async (data: any) => {
  const response = await apiAxios.patch(`${API_BASE_URL}`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const updateProfileImage = async (imageUrl: string) => {
  const response = await apiAxios.put(
    `${API_BASE_URL}/image`,
    { imageUrl },
    { withCredentials: true }
  );
  return response.data;
};

export const deleteProfileImage = async (): Promise<void> => {
  await apiAxios.delete(`${API_BASE_URL}/image`, {
    withCredentials: true,
  });
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const response = await apiAxios.patch(
    `${API_BASE_URL}/change-password`,
    { currentPassword, newPassword, confirmPassword },
    { withCredentials: true }
  );
  return response.data;
};
