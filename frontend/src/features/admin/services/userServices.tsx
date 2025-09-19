import { APIResponse, HTTPErrorResponse } from "../../../types/api";

import { getErrorMessage, handleApiError } from "../../../utils/apiError";
import { PaginatedUserData, User } from "../types/user";
import apiAxios from "../../../utils/apiAxios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;
const BASE_URL = `${API_BASE_URL}/admin/users`;

// Get users with pagination + optional search
export const getUsers = async (
  page = 1,
  limit = 10,
  searchQuery?: string
): Promise<PaginatedUserData> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (searchQuery) {
      params.append("search", searchQuery);
    }

    const response = await apiAxios.get<APIResponse<PaginatedUserData>>(
      `${BASE_URL}?${params.toString()}`,
      { withCredentials: true }
    );

    // ✅ .data contains { users, pagination }
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch users");
  }
};

// Block user
export const blockUser = async (userId: string): Promise<User> => {
  try {
    const response = await apiAxios.patch<APIResponse<User>>(
      `${BASE_URL}/block/${userId}`,
      {},
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to block user");
  }
};

// Unblock user
export const unblockUser = async (userId: string): Promise<User> => {
  try {
    const response = await apiAxios.patch<APIResponse<User>>(
      `${BASE_URL}/unblock/${userId}`,
      {},
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to unblock user");
  }
};
