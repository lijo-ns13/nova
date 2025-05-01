export interface Company {
  _id: string;
  companyName: string;
  email: string;
  isBlocked: boolean;
  isVerified: boolean;
  industryType?: string;
  location?: string;
  documents?: string[];
  profilePicture?: string;
}

export interface Pagination {
  totalCompanies: number;
  totalPages: number;
  currentPage: number;
  companiesPerPage: number;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    companies: Company[];
    pagination: Pagination;
  };
}
export interface CompanyVerification {
  _id: string;
  companyName: string;
  email: string;
  industryType: string;
  foundedYear: number;
  location: string;
  verificationStatus: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  about?: string;
  documents: string[];
}
