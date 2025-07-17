export interface CompanySummaryDTO {
  id: string;
  companyName: string;
  email: string;
  industryType: string;
  isVerified: boolean;
  verificationStatus: "pending" | "accepted" | "rejected";
  isBlocked: boolean;
  documents: string[]; // signed URLs
}
export interface CompanyWithSignedDocsDTO {
  id: string;
  companyName: string;
  email: string;
  industryType: string;
  isVerified: boolean;
  verificationStatus: "pending" | "accepted" | "rejected";
  isBlocked: boolean;
  documents: string[]; // Signed URLs
}

export interface CompanyPaginatedResponse {
  companies: CompanyWithSignedDocsDTO[];
  pagination: {
    totalCompanies: number;
    totalPages: number;
    currentPage: number;
    companiesPerPage: number;
  };
}
export interface CompanyBaseDTO {
  id: string;
  companyName: string;
  email: string;
  industryType: string;
  isVerified: boolean;
  verificationStatus: "pending" | "accepted" | "rejected";
  isBlocked: boolean;
}
