export const COMMON_ROUTES = {
  ROOT: "/",
  BY_ID: "/:id",
  SEARCH: "/search",
  DETAILS: "/details",
  IMAGE: "/image",
  CHANGE_PASSWORD: "/change-password",
  USER: "/user",
  SKILL_BY_ID: "/:skillId",
  USERSUB: "/usersub",
  STATS: "/stats",
} as const;

export const PROFILE_VIEW_ROUTES = {
  BY_USERNAME: "/users/:username", // → /users/:username
  POSTS_BY_USERNAME: "/users/post/:username", // → /users/post/:username
};
export const NOTIFICATION_ROUTES = {
  ROOT: "/",
  READ: "/:notificationId/read",
  READ_ALL: "/read-all",
  UNREAD_COUNT: "/unread-count",
  DELETE_ALL: "/delete-all",
  DELETE: "/:notificationId",
} as const;
export const COMMON_MAIN_ROUTES = {
  SKILL: "/skill",
  PROFILE: "/api",
  MESSAGES: "/messages",
  NOTIFICATION: "/notification",
} as const;
export const MESSAGE_ROUTES = {
  CHAT_USERS: "/chat/users/:userId",
  USERNAME: "/username/:otherUserId",
  CONVERSATION: "/:userId/:otherUserId",
} as const;
