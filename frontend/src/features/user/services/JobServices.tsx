import userAxios from "../../../utils/userAxios";

const API_BASE_URL = "http://localhost:3000";

// Get all jobs
export const getJobs = async () => {
  const response = await userAxios.get(`${API_BASE_URL}/jobs`);
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
  const response = await userAxios.get(`${API_BASE_URL}/saved-jobs`, {
    withCredentials: true,
  });
  return response.data;
};

// Get all applied jobs
export const getAppliedJobs = async () => {
  const response = await userAxios.get(`${API_BASE_URL}/applied-jobs`, {
    withCredentials: true,
  });
  return response.data;
};
