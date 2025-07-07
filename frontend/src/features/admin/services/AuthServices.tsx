import axios from "axios";
import { AdminSignInInput, AdminSignInResponse } from "../types/adminAuth";
import { handleApiError } from "../../../utils/apiError";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/auth/admin`;

export const AdminAuthService = {
  async signIn(data: AdminSignInInput): Promise<AdminSignInResponse> {
    try {
      const response = await axios.post<AdminSignInResponse>(
        `${BASE_URL}/signin`,
        data,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error, "Failed to sign in admin");
    }
  },
};
