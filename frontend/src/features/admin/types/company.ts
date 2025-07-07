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
