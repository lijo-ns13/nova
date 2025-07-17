export interface CompanyResponse {
  id: string;
  companyName: string;
  email: string;
  isBlocked: boolean;
  profilePicture: string | null;
}

export interface PaginatedCompanyResponse {
  companies: CompanyResponse[];
  total: number;
  page: number;
  limit: number;
}
// src/types/company.ts

export interface CompanyDocumentDTO {
  id: string;
  companyName: string;
  email: string;
  industryType: string;
  isVerified: boolean;
  verificationStatus: "pending" | "verified" | "rejected";
  isBlocked: boolean;
  documents: string[];
}

export interface UnverifiedCompaniesResponse {
  companies: CompanyDocumentDTO[];
  pagination: {
    totalCompanies: number;
    totalPages: number;
    currentPage: number;
    companiesPerPage: number;
  };
}
