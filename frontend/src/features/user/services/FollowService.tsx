import userAxios from "../../../utils/userAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}`;

export interface HTTPErrorResponse {
  message: string;
  statusCode?: number;
}

export interface NetworkUser {
  // Define the actual interface for network users based on your API response
  id: string;
  name: string;
  // ... other fields
}

export interface FollowStatus {
  // Define the actual interface for follow status based on your API response
  isFollowing: boolean;
  // ... other fields
}

export interface FollowersResponse {
  // Define the actual interface for followers response
  followers: NetworkUser[];
  count: number;
}

export interface FollowingResponse {
  // Define the actual interface for following response
  following: NetworkUser[];
  count: number;
}

export const getNetworkUsers = async (): Promise<NetworkUser[]> => {
  try {
    const response = await userAxios.get<NetworkUser[]>(
      `${BASE_URL}/users/network-users`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to fetch network users",
    } as HTTPErrorResponse;
  }
};

export const followUser = async (
  followerId: string
): Promise<{ success: boolean }> => {
  try {
    const response = await userAxios.post<{ success: boolean }>(
      `${BASE_URL}/users/${followerId}/follow`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to follow user",
    } as HTTPErrorResponse;
  }
};

export const unFollowUser = async (
  followerId: string
): Promise<{ success: boolean }> => {
  try {
    const response = await userAxios.post<{ success: boolean }>(
      `${BASE_URL}/users/${followerId}/unfollow`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to unfollow user",
    } as HTTPErrorResponse;
  }
};

export const getFollowers = async (
  userId: string
): Promise<FollowersResponse> => {
  try {
    const response = await userAxios.get<FollowersResponse>(
      `${BASE_URL}/users/${userId}/followers`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to fetch followers",
    } as HTTPErrorResponse;
  }
};

export const getFollowing = async (
  userId: string
): Promise<FollowingResponse> => {
  try {
    const response = await userAxios.get<FollowingResponse>(
      `${BASE_URL}/users/${userId}/following`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to fetch following",
    } as HTTPErrorResponse;
  }
};

export const checkIsFollowUser = async (
  userId: string
): Promise<FollowStatus> => {
  try {
    const response = await userAxios.get<FollowStatus>(
      `${BASE_URL}/users/${userId}/check-status`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to check follow status",
    } as HTTPErrorResponse;
  }
};

// Helper to extract error message
function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null) {
    const err = error as any;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.data?.error) return err.response.data.error;
    if (err.message) return err.message;
  }
  return undefined;
}
