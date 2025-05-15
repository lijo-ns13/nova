import companyAxios from "../../../utils/companyAxios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_BASE_URL = `${BASE_URL}/company/profile`;

// User Profile
export const getCompanyProfile = async () => {
  const response = await companyAxios.get(`${API_BASE_URL}`);
  return response.data;
};
export const getCompanyProfileWithDetails = async () => {
  const response = await companyAxios.get(`${API_BASE_URL}/details`);
  return response.data;
};

export const updateCompanyProfile = async (data: any) => {
  const response = await companyAxios.patch(`${API_BASE_URL}`, data, {
    withCredentials: true,
  });
  return response.data;
};

export const updateProfileImage = async (imageUrl: string) => {
  const response = await companyAxios.put(
    `${API_BASE_URL}/image`,
    { imageUrl },
    { withCredentials: true }
  );
  return response.data;
};

export const deleteProfileImage = async (): Promise<void> => {
  await companyAxios.delete(`${API_BASE_URL}/image`, {
    withCredentials: true,
  });
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
) => {
  const response = await companyAxios.patch(
    `${API_BASE_URL}/change-password`,
    { currentPassword, newPassword, confirmPassword },
    { withCredentials: true }
  );
  return response.data;
};
