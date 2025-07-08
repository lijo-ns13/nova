import companyAxios from "../../../utils/companyAxios";
import { APIResponse } from "../../../types/api";
import { handleApiError } from "../../../utils/apiError";

export type ApplicationStatus =
  | "applied"
  | "shortlisted"
  | "rejected"
  | "interview_scheduled"
  | "interview_cancelled"
  | "interview_accepted_by_user"
  | "interview_rejected_by_user"
  | "interview_reschedule_proposed"
  | "interview_reschedule_accepted"
  | "interview_reschedule_rejected"
  | "interview_completed"
  | "interview_passed"
  | "interview_failed"
  | "offered"
  | "selected"
  | "hired"
  | "withdrawn";

export type UpdateApplicationStatusInput = {
  status: ApplicationStatus;
  reason?: string;
};

export type ApplicationDetailDTO = {
  id: string;
  userId: string;
  userName?: string;
  userProfilePicture?: string;
  jobId: string;
  jobTitle?: string;
  companyName?: string;
  status: ApplicationStatus;
  resumeUrl?: string;
  appliedAt: Date;
  scheduledAt?: Date;
  reason?: string;
  coverLetter?: string;
};

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/company/applicant`;

export const ApplicantService = {
  async getApplicationDetails(
    applicationId: string
  ): Promise<ApplicationDetailDTO> {
    try {
      const response = await companyAxios.get<
        APIResponse<ApplicationDetailDTO>
      >(`${BASE_URL}/${applicationId}`, {
        withCredentials: true,
      });
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
      const response = await companyAxios.patch<
        APIResponse<ApplicationDetailDTO>
      >(`${BASE_URL}/${applicationId}/status`, data, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (err) {
      throw handleApiError(err, "Failed to update application status");
    }
  },
};
