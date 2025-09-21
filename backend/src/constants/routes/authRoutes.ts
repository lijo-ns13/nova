export const AUTH_ROUTES = {
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  VERIFY: "/verify",
  RESEND: "/resend",
  LOGOUT: "/logout",
  FORGOT_PASSWORD: "/forget-password",
  RESET_PASSWORD: "/reset-password",
} as const;

// src/constants/authRoutes.ts
export const MAIN_AUTH_ROUTES = {
  ADMIN: "/admin",
  COMPANY: "/company",
  USER: "/",
} as const;
