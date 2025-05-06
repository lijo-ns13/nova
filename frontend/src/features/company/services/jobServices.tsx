// src/modules/company/services/jobService.ts
import companyAxios from "../../../utils/companyAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BASE_URL = `${API_BASE_URL}/company/job`;

export const JobService = {
  async createJob(data: any) {
    const response = await companyAxios.post(BASE_URL, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async updateJob(jobId: string, data: any) {
    const response = await companyAxios.put(`${BASE_URL}/${jobId}`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  async deleteJob(jobId: string) {
    const response = await companyAxios.delete(`${BASE_URL}/${jobId}`, {
      withCredentials: true,
    });
    return response.data;
  },

  async getJobs(page = 1, limit = 10) {
    const response = await companyAxios.get(
      `${BASE_URL}?page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  async getJobApplicants(jobId: string, page = 1, limit = 10) {
    const response = await companyAxios.get(
      `${BASE_URL}/${jobId}/applications?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
    return response.data;
  },
  async getJob(jobId: string) {
    const response = await companyAxios.get(`${BASE_URL}/${jobId}`, {
      withCredentials: true,
    });
    return response.data;
  },
};
