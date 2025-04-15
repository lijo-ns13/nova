export const JWT_SECRETS = {
  user: {
    access: process.env.USER_ACCESS_TOKEN_SECRET || "defaultUserAccessSecret",
    refresh:
      process.env.USER_REFRESH_TOKEN_SECRET || "defaultUserRefreshSecret",
    accessExpiry: "1h",
    refreshExpiry: "7d",
  },
  admin: {
    access: process.env.ADMIN_ACCESS_TOKEN_SECRET || "defaultAdminAccessSecret",
    refresh:
      process.env.ADMIN_REFRESH_TOKEN_SECRET || "defaultAdminRefreshSecret",
    accessExpiry: "1h",
    refreshExpiry: "30d",
  },
  company: {
    access:
      process.env.COMPANY_ACCESS_TOKEN_SECRET || "defaultCompanyAccessSecret",
    refresh:
      process.env.COMPANY_REFRESH_TOKEN_SECRET || "defaultCompanyRefreshSecret",
    accessExpiry: "1h",
    refreshExpiry: "14d",
  },
};
