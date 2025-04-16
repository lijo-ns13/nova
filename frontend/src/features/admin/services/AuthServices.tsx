import axios from "axios";
const BASE_URL = "http://localhost:3000/auth/admin";
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
