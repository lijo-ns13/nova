// Define TypeScript interfaces for job data
export interface Salary {
  currency: string;
  min: number;
  max: number;
  isVisibleToApplicants: boolean;
}

export interface Skill {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Company {
  _id: string;
  companyName: string;
  about: string;
  email: string;
  industryType: string;
  foundedYear: number;
  location: string;
  isVerified: boolean;
  isBlocked: boolean;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Job {
  _id: string;
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  employmentType: string;
  experienceLevel: string;
  skillsRequired: Skill[];
  benefits: string[];
  perks: string[];
  applicationDeadline: string;
  company: Company;
  salary: Salary;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FilterOptions {
  jobType: string[];
  employmentType: string[];
  experienceLevel: string[];
  minSalary: string;
  maxSalary: string;
  [key: string]: string | string[];
}

export interface JobFilterParams {
  title?: string;
  location?: string;
  jobType?: string | string[];
  employmentType?: string | string[];
  experienceLevel?: string | string[];
  skills?: string | string[];
  minSalary?: string | number;
  maxSalary?: string | number;
  company?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedJobResponse {
  success: boolean;
  data: Job[];
  pagination: PaginationState;
}
