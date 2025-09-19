import axios, { AxiosError } from "axios";
import { handleApiError } from "../../../utils/apiError";
import {
  CompanySignUpInput,
  CompanySignUpResponse,
  CompanySignInInput,
  CompanySignInResponse,
  VerifyOtpInput,
  GenericSuccessResponse,
  ResetPasswordInput,
  ForgetPasswordInput,
  VerifyOtpResponse,
} from "../types/auth";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;
const BASE_URL = `${API_BASE_URL}/auth/company`;

export const CompanyAuthService = {
  async signUp(formData: FormData): Promise<CompanySignUpResponse> {
    try {
      const response = await axios.post<CompanySignUpResponse>(
        `${BASE_URL}/signup`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to sign up company");
    }
  },

  async signIn(data: CompanySignInInput): Promise<CompanySignInResponse> {
    try {
      const response = await axios.post<CompanySignInResponse>(
        `${BASE_URL}/signin`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to sign in company");
    }
  },

  async verifyOTP(data: VerifyOtpInput): Promise<VerifyOtpResponse> {
    try {
      const response = await axios.post<VerifyOtpResponse>(
        `${BASE_URL}/verify`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to verify OTP");
    }
  },

  async resendOTP(email: string): Promise<GenericSuccessResponse> {
    try {
      const response = await axios.post<GenericSuccessResponse>(
        `${BASE_URL}/resend`,
        { email },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to resend OTP");
    }
  },

  async forgetPassword(
    data: ForgetPasswordInput
  ): Promise<GenericSuccessResponse> {
    try {
      const response = await axios.post<GenericSuccessResponse>(
        `${BASE_URL}/forget-password`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to send reset email");
    }
  },

  async resetPassword(
    data: ResetPasswordInput
  ): Promise<GenericSuccessResponse> {
    try {
      const response = await axios.post<GenericSuccessResponse>(
        `${BASE_URL}/reset-password`,
        data,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to reset password");
    }
  },
};
