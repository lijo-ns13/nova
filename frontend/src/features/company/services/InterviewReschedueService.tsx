import companyAxios from "../../../utils/companyAxios";
import { APIResponse } from "../../../types/api";
import { handleApiError } from "../../../utils/apiError";

export type InterviewResponseDTO = {
  id: string;
  roomId: string;
  scheduledAt: string;
  status: "pending" | "accepted" | "rejected" | "reschedule_proposed";
  result: "pending" | "pass" | "fail";
  rescheduleReason?: string;
  rescheduleProposedSlots?: string[];
  rescheduleSelectedSlot?: string;
};
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/company/interview`;

export type UpcomingInterviewResponseDTO = {
  id: string;
  roomId: string;
  interviewTime: string;
  applicationId: string;
  user: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    jobType: string;
  };
};

export interface ProposeRescheduleInput {
  reason: string;
  jobId: string;
  timeSlots: string[]; // ISO date strings
}

class CompanyInterviewService {
  async getUpcomingInterviews(): Promise<UpcomingInterviewResponseDTO[]> {
    try {
      const res = await companyAxios.get<
        APIResponse<UpcomingInterviewResponseDTO[]>
      >(`${BASE_URL}/upcoming`);
      return res.data.data;
    } catch (error) {
      throw handleApiError(error, "Failed to fetch upcoming interviews");
    }
  }

  async proposeReschedule(
    applicationId: string,
    input: ProposeRescheduleInput
  ): Promise<InterviewResponseDTO> {
    try {
      const res = await companyAxios.post<APIResponse<InterviewResponseDTO>>(
        `${BASE_URL}/${applicationId}/reschedule`,
        input
      );
      return res.data.data;
    } catch (error) {
      throw handleApiError(error, "Failed to propose reschedule");
    }
  }

  async scheduleInterview(input: {
    userId: string;
    applicationId: string;
    jobId: string;
    scheduledAt: string;
  }): Promise<InterviewResponseDTO> {
    try {
      const res = await companyAxios.post<APIResponse<InterviewResponseDTO>>(
        `${BASE_URL}`,
        input
      );
      return res.data.data;
    } catch (error) {
      throw handleApiError(error, "Failed to schedule interview");
    }
  }
}

export const companyInterviewService = new CompanyInterviewService();
