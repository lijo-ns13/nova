import { APIResponse } from "../../../types/api";
import { handleApiError } from "../../../utils/apiError";
import { ApplicationStatus } from "../../../constants/applicationStatus";
import apiAxios from "../../../utils/apiAxios";

export type UpdateApplicationStatusInput = {
  status: ApplicationStatus;
  reason?: string;
};

export type ApplicationDetailDTO = {
  id: string;
  jobId: string;
  jobTitle?: string;
  companyName?: string;
  userId: string;
  name?: string;
  username?: string;
  userProfilePicture?: string;
  status: ApplicationStatus;
  resumeUrl?: string;
  appliedAt: string; // ISO string from Date
  scheduledAt?: string; // ISO string from Date
  reason?: string;
  coverLetter?: string;
  statusHistory?: {
    status: ApplicationStatus;
    reason?: string;
    updatedAt: string; // ISO string from Date
  }[];
};

const BASE_URL = `${
  import.meta.env.VITE_API_BASE_URL
}/api/v1/company/applicant`;

export const ApplicantService = {
  async getApplicationDetails(
    applicationId: string
  ): Promise<ApplicationDetailDTO> {
    try {
      const response = await apiAxios.get<APIResponse<ApplicationDetailDTO>>(
        `${BASE_URL}/${applicationId}`,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (err) {
      throw handleApiError(err, "Failed to load application details");
    }
  },

  async updateApplicationStatus(
    applicationId: string,
    data: UpdateApplicationStatusInput
  ): Promise<ApplicationDetailDTO> {
    try {
      const response = await apiAxios.patch<APIResponse<ApplicationDetailDTO>>(
        `${BASE_URL}/${applicationId}/status`,
        data,
        {
          withCredentials: true,
        }
      );
      return response.data.data;
    } catch (err) {
      throw handleApiError(err, "Failed to update application status");
    }
  },
};
