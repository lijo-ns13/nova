import {
  HTTPErrorResponse,
  ParsedAPIError,
  APIResponse,
} from "../../../types/api";
import apiAxios from "../../../utils/apiAxios";
import { handleApiError } from "../../../utils/apiError";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;
const BASE_URL = `${API_BASE_URL}/users`;

export interface User {
  id: string;
  name: string;
  username: string;
  profilePicture?: string | null;
  headline?: string;
}

export interface NetworkUser {
  user: User;
  isFollowing: boolean;
  isCurrentUser?: boolean;
}

export interface FollowStatusResponse {
  success: boolean;
  isFollowing: boolean;
}

export interface BasicResponse {
  success: boolean;
  message: string;
}
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NetworkUserResponse {
  users: NetworkUser[];
  pagination: PaginationInfo;
}

export const getNetworkUsers = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<NetworkUserResponse> => {
  try {
    const res = await apiAxios.get<APIResponse<NetworkUserResponse>>(
      `${BASE_URL}/network-users`,
      {
        params: { page, limit, search },
      }
    );
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch network users");
  }
};

export const followUser = async (userId: string): Promise<BasicResponse> => {
  try {
    const res = await apiAxios.post<BasicResponse>(
      `${BASE_URL}/${userId}/follow`
    );
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to follow user");
  }
};

export const unfollowUser = async (userId: string): Promise<BasicResponse> => {
  try {
    const res = await apiAxios.post<BasicResponse>(
      `${BASE_URL}/${userId}/unfollow`
    );
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to unfollow user");
  }
};

export const getFollowers = async (userId: string): Promise<NetworkUser[]> => {
  try {
    const res = await apiAxios.get<APIResponse<NetworkUser[]>>(
      `${BASE_URL}/${userId}/followers`
    );
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch followers");
  }
};

export const getFollowing = async (userId: string): Promise<NetworkUser[]> => {
  try {
    const res = await apiAxios.get<APIResponse<NetworkUser[]>>(
      `${BASE_URL}/${userId}/following`
    );
    return res.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch following");
  }
};

export const checkFollowStatus = async (
  userId: string
): Promise<FollowStatusResponse> => {
  try {
    const res = await apiAxios.get<FollowStatusResponse>(
      `${BASE_URL}/${userId}/follow-status`
    );
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Failed to check follow status");
  }
};
