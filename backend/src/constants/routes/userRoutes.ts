export const USER_FOLLOW_ROUTES = {
  NETWORK_USERS: "/network-users",
  FOLLOW: "/:userId/follow",
  UNFOLLOW: "/:userId/unfollow",
  FOLLOWERS: "/followers/:userId",
  FOLLOWING: "/following/:userId",
  FOLLOW_STATUS: "/:userId/follow-status",
};
export const USER_INTERVIEW_ROUTES = {
  UPDATE_STATUS: "/interview/updatestatus/:applicationId/:status",
  RESCHEDULE_RESPONSE: "/application/:applicationId/reschedule-response",
  RESCHEDULE_SLOTS: "/application/:applicationId/reschedule-slots",
} as const;
export const USER_JOB_ROUTES = {
  ROOT: "/jobs",
  APPLIED_JOBS: "/jobs/applied-jobs",
  JOB_DETAIL: "/jobs/:jobId",
  CHECK_APPLICATION: "/jobs/:jobId/check-application",
  APPLY: "/jobs/:jobId/apply",
} as const;
export const POST_ROUTES = {
  ROOT: "/",
  BY_ID: "/:postId",
  USER_POSTS: "/user",
  LIKE: "/like/:postId",
  COMMENT_ROOT: "/comment",
  COMMENT_BY_ID: "/comment/:commentId",
  COMMENT_BY_POST: "/comment/:postId",
} as const;
export const USER_PROFILE_ROUTES = {
  ROOT: "/",
  CHANGE_PASSWORD: "/change-password",
  PROFILE_IMAGE: "/profile-image",

  EDUCATION: "/education",
  EDUCATION_ID: "/education/:educationId",
  EDUCATIONS: "/educations",

  EXPERIENCE: "/experience",
  EXPERIENCE_ID: "/experience/:experienceId",
  EXPERIENCES: "/experiences",

  PROJECT: "/project",
  PROJECT_ID: "/project/:projectId",
  PROJECTS: "/projects",

  CERTIFICATE: "/certificate",
  CERTIFICATE_ID: "/certificate/:certificateId",
  CERTIFICATES: "/certificates",
} as const;

export const USER_ROUTES = {
  JOB: "/",
  PROFILE: "/user-profile",
  POST: "/post",
  INTERVIEW: "/",
  USER_SKILLS: "/userskills",
  USERS: "/users",
  SUBSCRIPTION_FEATURE: "/subfeat",
} as const;
export const TRANSACTION_ROUTES = {
  CREATE_CHECKOUT_SESSION: "/create-checkout-session",
  REFUND: "/refund",
  CONFIRM_SESSION: "/confirm-session/:sessionId",
  GET_SESSION: "/session/:userId",
  GET_SESSION_DETAILS: "/session-details/:sessionId",
} as const;
