import axios from "axios";
import toast from "react-hot-toast";
const BASE_URL = "http://localhost:3000/company/auth";
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
  } catch (error: any) {
    const message =
      error.response?.data?.error ||
      "An error occurred during company signupy.";
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

    // const { success, role, company,isVerified,isBlcoked } = response.data;

    // if (!success) {
    //   alert("Signin failed");
    //   return;
    // }
    return response.data;
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response?.data?.error || "Something went wrong";
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
