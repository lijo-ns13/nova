import { IJobWithSkills } from "../../mapping/job.mapper";
import {
  IJobPopulated,
  IJobWithCompanyAndSkills,
} from "../../mapping/user/jobmapper";
import { IApplication } from "../../models/application.modal";
import { IJob } from "../../models/job.modal";
import { PopulatedApplicationWithUserAndResume } from "../../repositories/mongo/JobRepository";
import { IBaseRepository } from "./IBaseRepository";
export interface JobFilters {
  title?: string;
  location?: string;
  jobType?: string | string[];
  employmentType?: string | string[];
  experienceLevel?: string | string[];
  skills?: string[]; // ObjectId strings
  minSalary?: number;
  maxSalary?: number;
  company?: string; // ObjectId string
}

export interface PaginatedJobResult {
  jobs: IJob[];
  total: number;
  totalPages: number;
}
export interface CreateJobDto {
  title: string;
  description: string;
  location: string;
  jobType: string; // remote, hybrid, on-site
  employmentType: string; // full-time, part-time, etc.
  experienceLevel: string; // entry, mid, etc.
  skillsRequired: string[]; // Array of skill ObjectIds
  salary: {
    currency: string;
    min: number;
    max: number;
    isVisibleToApplicants: boolean;
  };
  benefits: string[];
  perks?: string[];
  applicationDeadline: Date;
}

export interface UpdateJobDto extends Partial<CreateJobDto> {}

export interface JobCandidate {
  user: {
    _id: string;
    name: string;
    email: string;
    resumeUrl: string;
  };
  status: string;
  appliedAt: Date;
  rejectionReason?: string;
  notes?: string;
}

export interface IJobRepository extends IBaseRepository<IJob> {
  createJob(createJobDto: CreateJobDto, companyId: string): Promise<IJob>;

  updateJob(
    jobId: string,
    companyId: string,
    updateJobDto: UpdateJobDto
  ): Promise<IJob | null>;

  deleteJob(jobId: string, companyId: string): Promise<boolean>;
  getJobs(
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ jobs: IJobWithSkills[]; total: number }>;
  getJob(jobId: string): Promise<any>;
  getAllJobs(
    page: number,
    limit: number,
    filters: Record<string, unknown>
  ): Promise<{ jobs: IJobPopulated[]; total: number; totalPages: number }>;
  applyToJob(
    jobId: string,
    userId: string,
    resumeUrl: string,
    coverLetter?: string
  ): Promise<any>;

  getApplicantDetails(
    applicantId: string
  ): Promise<PopulatedApplicationWithUserAndResume | null>;
}
