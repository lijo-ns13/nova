import axios, { AxiosError } from "axios";
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;

const BASE_URL = `${API_BASE_URL}/auth`;
// types/auth.types.ts

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  headline?: string;
  username?: string;
  isSubscriptionActive?: boolean;
  subscriptionEndDate?: Date | string | null;
  appliedJobCount?: number;
  createdPostCount?: number;
}

export interface SignInResponse {
  success: true;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
  role: "user";
  isVerified: boolean;
  isBlocked: boolean;
}

export interface SignUpResponse {
  success: true;
  message: string;
  tempUser: {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    expiresAt: string;
  };
}

export interface MessageResponse {
  success: true;
  message: string;
}

export interface ForgetPasswordResponse {
  success: true;
  message: string;
  token: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
}

function extractErrorMessage(error: AxiosError<ErrorResponse>): string {
  return error.response?.data?.error || "Something went wrong";
}

export const SignInUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/signin`,
      { email, password },
      {
        withCredentials: true,
      }
    );
    const { role, user, isVerified, isBlocked } = response.data;

    console.log("User:", user);
    console.log("Role:", role);
    console.log("isVeried:", isVerified);
    console.log("isBlcoked:", isBlocked);
    return response.data;
  } catch (error) {
    console.log("eroro", error);
    if (axios.isAxiosError<ErrorResponse>(error)) {
      throw extractErrorMessage(error);
    }
    throw "Something went wrong";
  }
};
export const SignUpUser = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/signup`,
      { name, email, password, confirmPassword },
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      throw extractErrorMessage(error);
    }
    throw "Something went wrong";
  }
};
export const verifyUserByOTP = async (email: string | null, otp: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/verify`,
      { email, otp },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      throw extractErrorMessage(error);
    }
    throw "Something went wrong";
  }
};
export const resendOTP = async (email: string | null) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/resend`,
      { email },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      throw extractErrorMessage(error);
    }
    throw "Something went wrong";
  }
};
export const forgetPasswordByEmail = async (email: string | null) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/forget-password`,
      { email },
      {
        withCredentials: true,
      }
    );
    // respnse =>token message success
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      throw extractErrorMessage(error);
    }
    throw "Something went wrong";
  }
};
export const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/reset-password`,
      { token, password, confirmPassword },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      throw extractErrorMessage(error);
    }
    throw "Something went wrong";
  }
};
export const logOut = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/logout`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      throw extractErrorMessage(error);
    }
    throw "Something went wrong";
  }
};
