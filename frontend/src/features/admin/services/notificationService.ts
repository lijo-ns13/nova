import apiAxios from "../../../utils/apiAxios";

export interface UnreadCountResponse {
  count: number;
}

/**
 * Fetch the unread notification count for the current user.
 * Uses credentials because it relies on the session cookie.
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  const res = await apiAxios.get<UnreadCountResponse>(
    "/notification/unread-count",
    { withCredentials: true }
  );
  return res.data.count;
};
