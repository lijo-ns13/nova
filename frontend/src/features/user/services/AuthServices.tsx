import axios from "axios";
const BASE_URL = "http://localhost:3000/auth";
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
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response?.data?.error || "Something went wrong";
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
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response?.data?.error || "Something went wrong";
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
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response?.data?.error || "Something went wrong";
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
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response?.data?.error || "Something went wrong";
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
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response?.data?.error || "Something went wrong";
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
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response?.data?.error || "Something went wrong";
  }
};
export const logOut = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/logout`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    console.log("API ERror", error);
    throw error?.response?.data?.error || "Something went wrong";
  }
};
