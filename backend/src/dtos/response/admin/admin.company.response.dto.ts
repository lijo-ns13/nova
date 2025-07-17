export interface CompanySummaryDTO {
  id: string;
  companyName: string;
  email: string;
  isBlocked: boolean;
}

export interface CompanyPaginatedResponse {
  companies: CompanySummaryDTO[];
  pagination: {
    totalCompanies: number;
    totalPages: number;
    currentPage: number;
    companiesPerPage: number;
  };
}
