import { APIResponse } from "../../../types/api";
import apiAxios from "../../../utils/apiAxios";
import { handleApiError } from "../../../utils/apiError";

export interface ApplicationStatusResponseDTO {
  id: string;
  user: string;
  job: string;
  appliedAt: string;
  scheduledAt?: string;
  statusHistory: {
    status: string;
    changedAt: string;
    reason?: string;
  }[];
}

export const acceptReschedule = async (
  applicationId: string,
  status: "interview_reschedule_accepted" | "interview_reschedule_rejected",
  selectedSlot?: string
): Promise<APIResponse<null>> => {
  try {
    const response = await apiAxios.put<APIResponse<null>>(
      `/application/${applicationId}/reschedule-response`,
      { status, selectedSlot }
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to accept interview reschedule");
  }
};
export const getRescheduleSlots = async (
  applicationId: string
): Promise<APIResponse<string[]>> => {
  try {
    const response = await apiAxios.get<APIResponse<string[]>>(
      `/application/${applicationId}/reschedule-slots`
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch reschedule slots");
  }
};
// /interview/updatestatus/:applicationId/:status
export const updateInterviewStatus = async (
  applicationId: string,
  status: string
): Promise<APIResponse<ApplicationStatusResponseDTO>> => {
  try {
    const response = await apiAxios.patch<
      APIResponse<ApplicationStatusResponseDTO>
    >(`/interview/updatestatus/${applicationId}/${status}`);

    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to update interview status");
  }
};
