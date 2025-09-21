import { APIResponse } from "../../../types/api";
import apiAxios from "../../../utils/apiAxios";
import { handleApiError } from "../../../utils/apiError";
import qs from "query-string";
export type CreateJobInput = {
  title: string;
  description: string;
  location: string;
  jobType: "remote" | "hybrid" | "on-site";
  employmentType:
    | "full-time"
    | "part-time"
    | "contract"
    | "temporary"
    | "internship"
    | "freelance";
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  skillsRequired: string[]; // these are skill IDs (ObjectId strings)
  salary: {
    min: number;
    max: number;
    currency: string;
    isVisibleToApplicants: boolean;
  };
  benefits: string[];
  applicationDeadline: Date;
  perks?: string[];
};

export type UpdateJobInput = {
  title?: string;
  description?: string;
  location?: string;
  jobType?: "remote" | "hybrid" | "on-site";
  employmentType?:
    | "full-time"
    | "part-time"
    | "contract"
    | "temporary"
    | "internship"
    | "freelance";
  experienceLevel?: "entry" | "mid" | "senior" | "lead";
  skillsRequired: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
    isVisibleToApplicants: boolean;
  };
  benefits?: string[];
  applicationDeadline?: Date;
  perks?: string[];
};
export type JobResponseDto = {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: "remote" | "hybrid" | "on-site";
  employmentType:
    | "full-time"
    | "part-time"
    | "contract"
    | "temporary"
    | "internship"
    | "freelance";
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  skillsRequired: string[]; // skill ids
  salary: {
    min: number;
    max: number;
    currency: string;
    isVisibleToApplicants: boolean;
  };
  benefits: string[];
  perks?: string[];
  applicationDeadline: Date;
  status: "open" | "closed" | "filled";
  createdAt: Date;
  updatedAt: Date;
};
export type ApplicantDetailDTO = {
  id: string;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    profilePicture?: string;
    headline?: string;
  };
  appliedAt: Date;
  status: string;
  statusHistory: {
    status: string;
    changedAt: Date;
    reason?: string;
  }[];
  resumeUrl: string | null;
  coverLetter?: string;
  scheduledAt?: Date;
};
export type ApplicantSummaryDTO = {
  applicationId: string;
  status: string;
  appliedAt: Date;
  name: string;
  email: string;
  profilePicture?: string;
};
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1`;
const BASE_URL = `${API_BASE_URL}/company/job`;
export const JobService = {
  async createJob(data: CreateJobInput): Promise<JobResponseDto> {
    try {
      const response = await apiAxios.post<APIResponse<JobResponseDto>>(
        BASE_URL,
        data,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (err) {
      throw handleApiError(err, "Failed to create job");
    }
  },

  async updateJob(
    jobId: string,
    data: UpdateJobInput
  ): Promise<JobResponseDto> {
    try {
      const response = await apiAxios.put<APIResponse<JobResponseDto>>(
        `${BASE_URL}/${jobId}`,
        data,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (err) {
      throw handleApiError(err, "Failed to update job");
    }
  },

  async deleteJob(jobId: string): Promise<void> {
    try {
      await apiAxios.delete<APIResponse<null>>(`${BASE_URL}/${jobId}`, {
        withCredentials: true,
      });
    } catch (err) {
      throw handleApiError(err, "Failed to delete job");
    }
  },

  async getJobs(
    page = 1,
    limit = 10
  ): Promise<{
    jobs: JobResponseDto[];
    pagination: PaginationMeta;
  }> {
    try {
      const response = await apiAxios.get<
        APIResponse<{
          jobs: JobResponseDto[];
          pagination: PaginationMeta;
        }>
      >(`${BASE_URL}?page=${page}&limit=${limit}`, {
        withCredentials: true,
      });

      return response.data.data;
    } catch (err) {
      throw handleApiError(err, "Failed to fetch jobs");
    }
  },

  async getJob(jobId: string): Promise<JobResponseDto> {
    try {
      const response = await apiAxios.get<APIResponse<JobResponseDto>>(
        `${BASE_URL}/${jobId}`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (err) {
      throw handleApiError(err, "Failed to get job");
    }
  },

  async getJobApplicants(
    jobId: string,
    page = 1,
    limit = 10,
    filters: {
      search?: string;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    } = {}
  ): Promise<{
    applications: ApplicantSummaryDTO[];
    pagination: {
      totalApplications: number;
      totalPages: number;
      currentPage: number;
      applicationsPerPage: number;
    };
  }> {
    try {
      const queryParams = qs.stringify({
        page,
        limit,
        ...filters,
      });

      const response = await apiAxios.get<
        APIResponse<{
          applications: ApplicantSummaryDTO[];
          pagination: {
            totalApplications: number;
            totalPages: number;
            currentPage: number;
            applicationsPerPage: number;
          };
        }>
      >(`${BASE_URL}/${jobId}/applicants?${queryParams}`, {
        withCredentials: true,
      });

      return response.data.data;
    } catch (err) {
      throw handleApiError(err, "Failed to get job applicants");
    }
  },

  async getApplicantDetails(
    applicationId: string
  ): Promise<ApplicantDetailDTO> {
    try {
      const response = await apiAxios.get<APIResponse<ApplicantDetailDTO>>(
        `${BASE_URL}/application/${applicationId}/details`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (err) {
      throw handleApiError(err, "Failed to get applicant details");
    }
  },

  async shortlistApplication(applicationId: string): Promise<void> {
    try {
      await apiAxios.patch<APIResponse<null>>(
        `${BASE_URL}/shortlist/${applicationId}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      throw handleApiError(err, "Failed to shortlist application");
    }
  },

  async rejectApplication(
    applicationId: string,
    rejectionReason?: string
  ): Promise<void> {
    try {
      await apiAxios.patch<APIResponse<null>>(
        `${BASE_URL}/reject/${applicationId}`,
        { rejectionReason },
        { withCredentials: true }
      );
    } catch (err) {
      throw handleApiError(err, "Failed to reject application");
    }
  },
};
