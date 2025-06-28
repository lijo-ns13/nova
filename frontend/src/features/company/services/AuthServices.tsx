import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export interface CompanyAuthApiError {
  success?: false;
  error?: string;
  errors?: Record<string, string>; // for Zod field errors
}
const BASE_URL = `${API_BASE_URL}/auth/company`;
export const signUpCompany = async (
  companyName: string,
  email: string,
  about: string = "",
  foundedYear: number,
  businessNumber: number,
  industryType: string,
  documents: string[] = [],
  password: string,
  confirmPassword: string,
  location: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/signup`,
      {
        companyName,
        email,
        about,
        foundedYear,
        businessNumber,
        industryType,
        documents,
        password,
        confirmPassword,
        location,
      },
      { withCredentials: true }
    );

    const { success } = response.data;

    if (!success) {
      toast.error("error occured");
      return;
    }

    toast.success("signin successfull");

    return { success };
  } catch (error) {
    const err = error as AxiosError<CompanyAuthApiError>;
    const message =
      err.response?.data?.error || "An error occurred during company signupy.";
    console.error("Signup error:", message);
    throw new Error(message);
  }
};
export const signInCompany = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/signin`,
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    const apiError = error as AxiosError<{ error: string }>;
    console.log("API Error:=>", apiError);
    throw apiError?.response?.data?.error || "Something went wrong";
  }
};
export const verifyCompanyByOTP = async (email: string | null, otp: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/verify`,
      { email, otp },
      {
        withCredentials: true,
      }
    );
    const { success, message } = response.data;
    if (!success) {
      toast.error(message || "error occured");
      return;
    }
    toast.success("successfully verfied");
  } catch (error) {
    console.log("error in serviced", error);
    throw error;
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
    const { success, message } = response.data;
    if (!success) {
      toast.error(message || "error occured");
      return;
    }
    toast.success("resent otp successfully");
  } catch (error) {
    console.log("errorin resned", error);
    throw error;
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
    const err = error as AxiosError<CompanyAuthApiError>;
    console.error("API Error:", err);
    throw err?.response?.data?.error || "Something went wrong";
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
    const err = error as AxiosError<CompanyAuthApiError>;
    console.log("API Error:", error);
    throw err?.response?.data?.error || "Something went wrong";
  }
};
