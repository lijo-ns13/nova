export interface AdminSignInInput {
  email: string;
  password: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export interface AdminSignInResponse {
  success: true;
  message: string;
  role: "admin";
  user: AdminUser;
  isVerified: boolean;
  isBlocked: boolean;
}
