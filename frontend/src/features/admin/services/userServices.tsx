import adminAxios from "../../../utils/adminAxios";
import { APIResponse, HTTPErrorResponse } from "../../../types/api";
import { UserResponse, PaginatedUserResponse } from "../types/user";
import { getErrorMessage, handleApiError } from "../../../utils/apiError";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/admin/users`;

// Get users with pagination + optional search
export const getUsers = async (
  page = 1,
  limit = 10,
  searchQuery?: string
): Promise<PaginatedUserResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (searchQuery) {
      params.append("search", searchQuery);
    }

    const response = await adminAxios.get<APIResponse<PaginatedUserResponse>>(
      `${BASE_URL}?${params.toString()}`,
      { withCredentials: true }
    );

    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch users");
  }
};

// Block user
export const blockUser = async (userId: string): Promise<UserResponse> => {
  try {
    const response = await adminAxios.patch<APIResponse<UserResponse>>(
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
export const unblockUser = async (userId: string): Promise<UserResponse> => {
  try {
    const response = await adminAxios.patch<APIResponse<UserResponse>>(
      `${BASE_URL}/unblock/${userId}`,
      {},
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to unblock user");
  }
};
