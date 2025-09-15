export interface JobResponseDTO {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  employmentType: string;
  experienceLevel: string;
  skills: string[];
  applicationDeadline: string;
  status: string;
}

export interface GetJobResponseDTO extends JobResponseDTO {
  salary: {
    currency: string;
    min: number;
    max: number;
    isVisibleToApplicants: boolean;
  };
  benefits: string[];
  perks?: string[];
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    companyName: string;
    foundedYear: string;
    username: string;
  };
}

export interface AppliedJobResponseDTO {
  _id: string; // from root "_id"
  appliedAt: string;
  status: string;
  scheduledAt?: string;
  resumeMediaId: string;

  job: {
    id: string;
    title: string;
    description: string;
    location: string;
    jobType: string;
  };

  statusHistory: {
    status: string;
    changedAt: string;
    reason?: string;
  }[];
}

export interface JobFilterParams {
  page?: number;
  limit?: number;
  title?: string;
  location?: string;
  jobType?: string | string[];
  employmentType?: string | string[];
  experienceLevel?: string | string[];
  skills?: string | string[];
  minSalary?: number;
  maxSalary?: number;
  company?: string;
}

export interface PaginatedJobResponse {
  jobs: JobResponseDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

import { APIResponse } from "../../../types/api";
import apiAxios from "../../../utils/apiAxios";
import { handleApiError } from "../../../utils/apiError";
import userAxios from "../../../utils/userAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Get all jobs with filters + pagination
export const getJobs = async (
  filters: JobFilterParams = {}
): Promise<APIResponse<PaginatedJobResponse>> => {
  try {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.title) params.append("title", filters.title);
    if (filters.location) params.append("location", filters.location);

    const appendArrayParam = (key: string, value: string | string[]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    };

    if (filters.jobType) appendArrayParam("jobType", filters.jobType);
    if (filters.employmentType)
      appendArrayParam("employmentType", filters.employmentType);
    if (filters.experienceLevel)
      appendArrayParam("experienceLevel", filters.experienceLevel);
    if (filters.skills) appendArrayParam("skills", filters.skills);
    if (filters.minSalary)
      params.append("minSalary", filters.minSalary.toString());
    if (filters.maxSalary)
      params.append("maxSalary", filters.maxSalary.toString());
    if (filters.company) params.append("company", filters.company);

    const res = await apiAxios.get<APIResponse<PaginatedJobResponse>>(
      `${API_BASE_URL}/jobs?${params.toString()}`
    );

    return res.data;
  } catch (err) {
    throw handleApiError(err, "Failed to fetch jobs");
  }
};

// ✅ Get single job
export const getJob = async (
  jobId: string
): Promise<APIResponse<GetJobResponseDTO>> => {
  try {
    const res = await apiAxios.get<APIResponse<GetJobResponseDTO>>(
      `${API_BASE_URL}/jobs/${jobId}`
    );
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Failed to fetch job details");
  }
};

// ✅ Check application status
export const getJobAppliedStatus = async (
  jobId: string
): Promise<APIResponse<boolean>> => {
  try {
    const res = await apiAxios.get<APIResponse<boolean>>(
      `${API_BASE_URL}/jobs/${jobId}/check-application`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Failed to check application status");
  }
};

// ✅ Apply to job
interface ApplyJobParams {
  jobId: string;
  resumeFile: File;
  coverLetter?: string;
}

export const applyJob = async ({
  jobId,
  resumeFile,
  coverLetter,
}: ApplyJobParams): Promise<APIResponse<boolean>> => {
  try {
    const formData = new FormData();
    formData.append("resume", resumeFile);
    if (coverLetter) {
      formData.append("coverLetter", coverLetter);
    }

    const res = await apiAxios.post<APIResponse<boolean>>(
      `${API_BASE_URL}/jobs/${jobId}/apply`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Job application failed");
  }
};

// ✅ Get applied jobs
export const getAppliedJobs = async (): Promise<
  APIResponse<AppliedJobResponseDTO[]>
> => {
  try {
    const res = await apiAxios.get<APIResponse<AppliedJobResponseDTO[]>>(
      `${API_BASE_URL}/jobs/applied-jobs/`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    throw handleApiError(err, "Failed to fetch applied jobs");
  }
};
