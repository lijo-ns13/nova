import userAxios from "../../../utils/userAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}`;

export interface HTTPErrorResponse {
  message: string;
  statusCode?: number;
}

export interface NetworkUser {
  _id: string;
  name: string;
  username: string;
  profilePicture: string | null;
  headline: string;
  isFollowing?: boolean;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
}

export interface FollowStatus {
  success: boolean;
  isFollowing: boolean;
}

export interface FollowersResponse {
  success: boolean;
  data: NetworkUserGetUsers[];
}

export interface FollowingResponse {
  success: boolean;
  data: NetworkUserGetUsers[];
}
//updated
export interface User {
  _id: string;
  name: string;
  username: string;
  profilePicture: string | null;
  headline: string;
}

export interface NetworkUserGetUsers {
  user: User;
  isFollowing: boolean;
  isCurrentUser?: boolean;
}
interface BasicResponse {
  success: boolean;
  message?: string;
}
export const getNetworkUsers = async (): Promise<NetworkUserGetUsers[]> => {
  try {
    const response = await userAxios.get<ApiListResponse<NetworkUserGetUsers>>(
      `${BASE_URL}/users/network-users`
    );
    return response.data.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to fetch network users",
    } as HTTPErrorResponse;
  }
};
export const followUser = async (userId: string): Promise<BasicResponse> => {
  try {
    const response = await userAxios.post<BasicResponse>(
      `${BASE_URL}/users/${userId}/follow`
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to follow user",
    } as HTTPErrorResponse;
  }
};

export const unFollowUser = async (userId: string): Promise<BasicResponse> => {
  try {
    const response = await userAxios.post<BasicResponse>(
      `${BASE_URL}/users/${userId}/unfollow`
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
      `${BASE_URL}/users/${userId}/follow-status`
    );
    console.log("responseiffollow", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to check follow status",
    } as HTTPErrorResponse;
  }
};

function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null) {
    const err = error as any;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.data?.error) return err.response.data.error;
    if (err.message) return err.message;
  }
  return undefined;
}
