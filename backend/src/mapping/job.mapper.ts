import { CreateJobRequest } from "../dtos/request/job.request.dto";
import { JobResponseDto } from "../dtos/response/job.response.dto";
import { IJob } from "../models/job.modal";

export const toCreateJobDto = (req: CreateJobRequest, companyId: string) => ({
  ...req,
  company: companyId,
});

export const toJobResponseDto = (job: IJob): JobResponseDto => ({
  id: job._id.toString(),
  title: job.title,
  description: job.description,
  location: job.location,
  jobType: job.jobType,
  employmentType: job.employmentType,
  experienceLevel: job.experienceLevel,
  salary: {
    currency: job.salary.currency,
    min: job.salary.min,
    max: job.salary.max,
    isVisibleToApplicants: job.salary.isVisibleToApplicants,
  },
  benefits: job.benefits,
  perks: job.perks,
  applicationDeadline: job.applicationDeadline,
  status: job.status,
  companyId: job.company.toString(),
  skillsRequired: job.skillsRequired.map((id) => id.toString()),
});
