import {
  IJob,
  JobApplication,
} from "../../../infrastructure/database/models/job.modal";

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

export interface IJobRepository {
  // 🟢 CREATE
  createJob(createJobDto: CreateJobDto, companyId: string): Promise<IJob>;

  // 🟡 UPDATE
  updateJob(
    jobId: string,
    companyId: string,
    updateJobDto: UpdateJobDto
  ): Promise<IJob | null>;

  // 🔴 DELETE
  deleteJob(jobId: string, companyId: string): Promise<boolean>;
  getJobs(
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ jobs: IJob[]; total: number }>;
  getJobApplications(
    jobId: string,
    companyId: string,
    page: number,
    limit: number
  ): Promise<{ applications: JobApplication[]; total: number } | null>;
  getJob(jobId: string): Promise<any>;
  getAllJobs(): Promise<IJob[]>;
  applyToJob(jobId: string, userId: string, resumeUrl: string): Promise<IJob>;
}
