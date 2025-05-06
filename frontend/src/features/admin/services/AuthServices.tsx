import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BASE_URL = `${API_BASE_URL}/auth/admin`;
export const SignInAdmin = async (email: string, password: string) => {
  try {
    const result = axios.post(
      `${BASE_URL}/signin`,
      { email, password },
      {
        withCredentials: true,
      }
    );
    const { isVerified, isBlocked, role, user } = (await result).data;
    return { isVerified, isBlocked, role, user };
  } catch (error: any) {
    console.error("API Error:", error);
    throw error?.response?.data?.error || "Something went wrong";
  }
};
