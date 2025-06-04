import companyAxios from "../../../utils/companyAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/company/applicant`;

export interface ApplicantUser {
  _id: string;
  username: string;
  name: string;
  profilePicture: string;
}

export interface ApplicantJob {
  title: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    isVisibleToApplicants: boolean;
  };
}
export interface UpdateApplicationStatusPayload {
  status: string;
  reason?: string;
}
export interface ApplicantData {
  success: boolean;
  data: {
    _id: string;
    job: ApplicantJob;
    user: ApplicantUser;
    status: string;
    appliedAt: string;
    updatedAt: string;
    resumeUrl?: string;
    resumeMediaId?: string;
    statusHistory: {
      status: string;
      reason?: string;
      changedAt: string;
    }[];
    createdAt?: string;
  };
}

export interface HTTPErrorResponse {
  message: string;
  statusCode?: number;
}

export const getApplicantById = async (
  applicantId: string
): Promise<ApplicantData> => {
  try {
    const result = await companyAxios.get<ApplicantData>(
      `${BASE_URL}/${applicantId}`,
      { withCredentials: true }
    );
    console.log("sdjlkdsfjlkfd", result.data);
    return result.data;
  } catch (error) {
    console.error("API Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to fetch applicant details",
    } as HTTPErrorResponse;
  }
};
export const updateApplicationStatus = async (
  applicantId: string,
  payload: UpdateApplicationStatusPayload
): Promise<ApplicantData> => {
  try {
    const response = await companyAxios.patch<ApplicantData>(
      `${BASE_URL}/${applicantId}/status`,
      payload,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Update Status Error:", error);
    throw {
      message: getErrorMessage(error) || "Failed to update application status",
    } as HTTPErrorResponse;
  }
};

// Helper to extract error message
function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null) {
    const err = error as any;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.message) return err.message;
  }
  return undefined;
}
