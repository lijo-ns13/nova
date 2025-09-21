import apiAxios from "../../../utils/apiAxios";
import { APIResponse } from "../../../types/api";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;
const BASE_URL = `${API_BASE_URL}/notification`;

export interface UnreadCountResponse {
  count: number;
}

/**
 * Get unread notification count for the logged-in company user
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  const result = await apiAxios.get<APIResponse<UnreadCountResponse>>(
    `${BASE_URL}/unread-count`,
    { withCredentials: true }
  );
  return result.data.data.count;
};
