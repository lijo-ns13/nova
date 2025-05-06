import userAxios from "../../../utils/userAxios";
import { JobFilterParams, PaginatedJobResponse } from "../types/jobTypes";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



export const getJobs = async (
  filters: JobFilterParams = {}
): Promise<PaginatedJobResponse> => {
  const params = new URLSearchParams();

  // Add pagination params
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());

  // Add filter params
  if (filters.title) params.append("title", filters.title);
  if (filters.location) params.append("location", filters.location);
  if (filters.jobType) {
    if (Array.isArray(filters.jobType)) {
      filters.jobType.forEach((type) => params.append("jobType", type));
    } else {
      params.append("jobType", filters.jobType);
    }
  }
  if (filters.employmentType) {
    if (Array.isArray(filters.employmentType)) {
      filters.employmentType.forEach((type) =>
        params.append("employmentType", type)
      );
    } else {
      params.append("employmentType", filters.employmentType);
    }
  }
  if (filters.experienceLevel) {
    if (Array.isArray(filters.experienceLevel)) {
      filters.experienceLevel.forEach((level) =>
        params.append("experienceLevel", level)
      );
    } else {
      params.append("experienceLevel", filters.experienceLevel);
    }
  }
  if (filters.skills) {
    if (Array.isArray(filters.skills)) {
      filters.skills.forEach((skill) => params.append("skills", skill));
    } else {
      params.append("skills", filters.skills);
    }
  }
  if (filters.minSalary)
    params.append("minSalary", filters.minSalary.toString());
  if (filters.maxSalary)
    params.append("maxSalary", filters.maxSalary.toString());
  if (filters.company) params.append("company", filters.company);

  const response = await userAxios.get(
    `${API_BASE_URL}/jobs?${params.toString()}`
  );
  return response.data;
};
// Get one job by ID
export const getJob = async (jobId: string) => {
  const response = await userAxios.get(`${API_BASE_URL}/jobs/${jobId}`);
  return response.data;
};

// Apply to a job
export const applyJob = async (jobId: string, resumeUrl: string) => {
  const response = await userAxios.post(
    `${API_BASE_URL}/jobs/${jobId}/apply`,
    { resumeUrl },
    { withCredentials: true }
  );
  return response.data;
};

// Save a job
export const saveJob = async (jobId: string) => {
  const response = await userAxios.post(
    `${API_BASE_URL}/jobs/${jobId}/save`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

// Unsave a job
export const unsaveJob = async (jobId: string) => {
  const response = await userAxios.delete(
    `${API_BASE_URL}/jobs/${jobId}/unsave`,
    { withCredentials: true }
  );
  return response.data;
};

// Get all saved jobs
export const getSavedJobs = async () => {
  const response = await userAxios.get(
    `http://localhost:3000/jobs/saved-jobs`,
    {
      withCredentials: true,
    }
  );
  console.log("responsedata in getSavedJobs", response.data);
  return response.data;
};

// Get all applied jobs
export const getAppliedJobs = async () => {
  const response = await userAxios.get(`${API_BASE_URL}/jobs/applied-jobs`, {
    withCredentials: true,
  });
  return response.data;
};
