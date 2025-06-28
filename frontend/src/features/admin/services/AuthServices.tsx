import axios, { AxiosError } from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BASE_URL = `${API_BASE_URL}/auth/admin`;
interface AuthErrorResponse {
  error: string;
  success?: boolean;
}

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
  } catch (err) {
    const error = err as AxiosError<AuthErrorResponse>;
    console.log("API Error:=>>>>", error);
    throw error?.response?.data?.error || "Something went wrong";
  }
};
