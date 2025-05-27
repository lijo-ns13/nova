import userAxios from "../../../utils/userAxios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BASE_URL = `${API_BASE_URL}/auth`;
export const followUser = async (followerId: string) => {
  try {
    const response = await userAxios.post(
      `${BASE_URL}/users/${followerId}/follow`
    );
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response?.data?.error || "Something went wrong";
  }
};
export const unFollowUser = async (followerId: string) => {
  try {
    const response = await userAxios.post(
      `${BASE_URL}/users/${followerId}/unfollow`
    );
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response?.data?.error || "Something went wrong";
  }
};
export const getFollowers = async (userId: string) => {
  try {
    const response = await userAxios.post(
      `${BASE_URL}/users/${userId}/followers`
    );
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response?.data?.error || "Something went wrong";
  }
};
export const getFollowing = async (userId: string) => {
  try {
    const response = await userAxios.get(
      `${BASE_URL}/users/${userId}/following`
    );
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response?.data?.error || "Something went wrong";
  }
};
export const checkIsFollowUser = async (userId: string) => {
  try {
    const response = await userAxios.get(
      `${BASE_URL}/users/${userId}/check-status`
    );
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response?.data?.error || "Something went wrong";
  }
};
