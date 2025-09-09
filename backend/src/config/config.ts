export const config = {
  accessTokenMaxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE) || 60 * 60 * 1000,
  refreshTokenMaxAge:
    Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
  cookieSecure: process.env.COOKIE_SECURE === "true",
  cookieSameSite:
    (process.env.COOKIE_SAMESITE as "lax" | "strict" | "none") || "none",
};
