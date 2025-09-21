import { COMMON_ROUTES } from "./commonRoutes";

export const ADMIN_COMPANY_ROUTES = {
  ROOT: "/",
  UNVERIFIED: "/unverified",
  BY_ID: "/:companyId",
  BLOCK: "/block/:companyId",
  UNBLOCK: "/unblock/:companyId",
  VERIFY: "/verify/:companyId",
} as const;

export const SUBSCRIPTION_PLAN_ROUTES = {
  ROOT: COMMON_ROUTES.ROOT, // "/"
  BY_ID: COMMON_ROUTES.BY_ID, // "/:id"
  TRANSACTIONS: "/transactions", // GET /transactions
  STATUS: "/:id/status", // PATCH /:id/status
} as const;
export const ADMIN_USER_ROUTES = {
  ROOT: COMMON_ROUTES.ROOT, // → /users
  BLOCK: "/block/:userId",
  UNBLOCK: "/unblock/:userId",
};
export const ADMIN_DASHBOARD_ROUTES = {
  REVENUE_STATS: "/revenue-stats",
  TOP_PLANS: "/top-plans",
  USER_GROWTH: "/user-growth",
  USER_STATS: "/user-stats",
  DOWNLOAD_REPORT: "/download-report",
  FULL_REPORT: "/full-report",
  TRANSACTIONS: "/transactions",
} as const;

export const ADMIN_ROUTES = {
  USERS: "/users",
  COMPANIES: "/companies",
  SKILLS: "/skills",
  SUBSCRIPTION: "/subscription",
  FEATURE: "/feature",
  ANALYTICS: "/analytics",
} as const;
