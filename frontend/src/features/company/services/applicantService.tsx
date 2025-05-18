import companyAxios from "../../../utils/companyAxios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.example.com";
const BASE_URL = `${API_BASE_URL}/company`;

export interface ApplicantResponse {
  success: boolean;
  message: string;
  data: {
    applications: Application[];
    pagination: PaginationInfo;
  };
}

export interface Application {
  _id: string;
  appliedAt: string;
  resumeUrl: string;
  coverLetter?: string;
  username?: string;
  status: "applied" | "shortlisted" | "rejected";
  statusHistory?: Array<{
    status: string;
    date: string;
    note?: string;
  }>;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  job: {
    _id: string;
    title: string;
    company: string;
  };
}

export interface PaginationInfo {
  totalApplications: number;
  totalPages: number;
  currentPage: number;
  applicationsPerPage: number;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  status?: string | string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

class ApplicantService {
  async getApplications(
    jobId: string | null,
    filters: FilterParams = {}
  ): Promise<ApplicantResponse> {
    try {
      // Convert filters to query parameters
      const queryParams = new URLSearchParams();

      if (filters.page) queryParams.append("page", filters.page.toString());
      if (filters.limit) queryParams.append("limit", filters.limit.toString());
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          filters.status.forEach((status) =>
            queryParams.append("status", status)
          );
        } else {
          queryParams.append("status", filters.status);
        }
      }
      if (filters.dateFrom) queryParams.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) queryParams.append("dateTo", filters.dateTo);
      if (filters.search) queryParams.append("search", filters.search);

      const response = await companyAxios.get(
        `${BASE_URL}/job/${jobId}/applicants?${queryParams.toString()}`,
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  }

  async rejectApplication(
    applicationId: string,
    rejectionReason?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await companyAxios.patch(
        `${BASE_URL}/job/reject/${applicationId}`,
        { rejectionReason }
      );

      return response.data;
    } catch (error) {
      console.error("Error rejecting application:", error);
      throw error;
    }
  }

  async shortlistApplicaton(
    applicationId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await companyAxios.patch(
        `${BASE_URL}/job/shortlist/${applicationId}`
      );

      return response.data;
    } catch (error) {
      console.error("Error shortlisting application:", error);
      throw error;
    }
  }
}

export const applicantService = new ApplicantService();
