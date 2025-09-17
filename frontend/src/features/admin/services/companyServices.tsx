import { APIResponse, HTTPErrorResponse } from "../../../types/api";
import { getErrorMessage, handleApiError } from "../../../utils/apiError";
import {
  CompanyResponse,
  PaginatedCompanyResponse,
  UnverifiedCompaniesResponse,
} from "../types/company";
import apiAxios from "../../../utils/apiAxios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/admin/companies`;

// Get paginated companies (optionally search)
export const getCompanies = async (
  page = 1,
  limit = 10,
  searchQuery?: string
): Promise<PaginatedCompanyResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (searchQuery) params.append("search", searchQuery);

    const result = await apiAxios.get<APIResponse<PaginatedCompanyResponse>>(
      `${BASE_URL}?${params.toString()}`,
      { withCredentials: true }
    );

    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch companies");
  }
};

// Get a single company by ID
export const getCompanyById = async (
  companyId: string
): Promise<CompanyResponse> => {
  try {
    const result = await apiAxios.get<APIResponse<CompanyResponse>>(
      `${BASE_URL}/${companyId}`,
      { withCredentials: true }
    );
    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch company");
  }
};

// Block company
export const blockCompany = async (
  companyId: string
): Promise<CompanyResponse> => {
  try {
    const result = await apiAxios.patch<APIResponse<CompanyResponse>>(
      `${BASE_URL}/block/${companyId}`,
      {},
      { withCredentials: true }
    );
    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to block company");
  }
};

// Unblock company
export const unblockCompany = async (
  companyId: string
): Promise<CompanyResponse> => {
  try {
    const result = await apiAxios.patch<APIResponse<CompanyResponse>>(
      `${BASE_URL}/unblock/${companyId}`,
      {},
      { withCredentials: true }
    );
    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to unblock company");
  }
};

export const getUnverifiedCompanies = async (
  page = 1,
  limit = 10
): Promise<UnverifiedCompaniesResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const result = await apiAxios.get<APIResponse<UnverifiedCompaniesResponse>>(
      `${BASE_URL}/unverified?${params.toString()}`,
      { withCredentials: true }
    );

    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch unverified companies");
  }
};
// Verify or reject company
export const verifyCompany = async (
  companyId: string,
  status: "approved" | "rejected",
  rejectionReason?: string
): Promise<CompanyResponse> => {
  try {
    const result = await apiAxios.patch<APIResponse<CompanyResponse>>(
      `${BASE_URL}/verify/${companyId}`,
      { status, rejectionReason },
      { withCredentials: true }
    );
    return result.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to verify company");
  }
};
