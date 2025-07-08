export interface CompanySignUpInput {
  companyName: string;
  email: string;
  about?: string;
  foundedYear: number;
  businessNumber: number;
  industryType: string;
  documents?: string[];
  password: string;
  confirmPassword: string;
  location: string;
}
export type CompanyResponseDTO = {
  id: string;
  companyName: string;
  email: string;
  about: string | null;
  industryType: string;
  foundedYear: number;
  documents: string[];
  location: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  website: string | null;
  companySize: number | null;
  isVerified: boolean;
  isBlocked: boolean;
  verificationStatus: "pending" | "accepted" | "rejected";
  profilePicture: string | null;
};

export interface TempCompanyResponseDTO {
  id: string;
  companyName: string;
  email: string;
  industryType: string;
  foundedYear: number;
  documents: string[];
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanySignUpResponse {
  success: boolean;
  message: string;
  data: TempCompanyResponseDTO;
}
export interface CompanySignInInput {
  email: string;
  password: string;
}

export interface CompanySignInResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  data: {
    id: string;
    companyName: string;
    email: string;
    username: string;
    isVerified: boolean;
    isBlocked: boolean;
  };
}
export interface VerifyOtpInput {
  email: string;
  otp: string;
}

export interface ForgetPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface GenericSuccessResponse {
  success: boolean;
  message: string;
}
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: CompanyResponseDTO;
}
