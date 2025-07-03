import userAxios from "../../../utils/userAxios";
import { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}`;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface ErrorResponse {
  message?: string;
}

export const acceptReschedule = async (
  applicationId: string,
  status: "interview_reschedule_accepted" | "interview_reschedule_rejected",
  selectedSlot?: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await userAxios.put<ApiResponse<null>>(
      `${BASE_URL}/application/${applicationId}/reschedule-response`,
      { status: status, selectedSlot }
    );
    return response.data;
  } catch (error) {
    console.error("Reschedule Error:", error);
    const axiosError = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message: axiosError.response?.data?.message || "Something went wrong",
    };
  }
};

export const getRescheduleSlots = async (
  applicationId: string
): Promise<ApiResponse<string[]>> => {
  try {
    const response = await userAxios.get<ApiResponse<string[]>>(
      `${BASE_URL}/application/${applicationId}/reschedule-slots`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching reschedule slots:", error);
    const axiosError = error as AxiosError<ErrorResponse>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        "Failed to fetch reschedule slots",
      data: [],
    };
  }
};
