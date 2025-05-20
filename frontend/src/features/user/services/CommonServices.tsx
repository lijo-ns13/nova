import userAxios from "../../../utils/userAxios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_BASE_URL = `${BASE_URL}/user-profile`;

// User Profile
export const getUserProfile = async (userId: string) => {
  const response = await userAxios.get(`${API_BASE_URL}/${userId}`);
  return response.data;
};
