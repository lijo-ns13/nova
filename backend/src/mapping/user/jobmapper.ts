import { IApplication } from "../../repositories/entities/application.entity";
import { ICompany } from "../../repositories/entities/company.entity";
import { IJob } from "../../repositories/entities/job.entity";
import { ISkill } from "../../repositories/entities/skill.entity";

export interface GetJobResponseDTO {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  employmentType: string;
  experienceLevel: string;
  skills: string[]; // Skill titles
  salary: {
    currency: string;
    min: number;
    max: number;
    isVisibleToApplicants: boolean;
  };
  benefits: string[];
  perks?: string[];
  applicationDeadline: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    companyName: string;
    username: string;
    foundedYear: string;
  };
}

// src/dtos/job/JobResponseDTO.ts
export interface JobResponseDTO {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  employmentType: string;
  experienceLevel: string;
  skills: string[]; // skill names or IDs
  applicationDeadline: string;
  status: string;
}
export interface AppliedJobResponseDTO {
  applicationId: string;
  jobId: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  employmentType: string;
  experienceLevel: string;
  skills: string[]; // skill titles only
  applicationDeadline: string;
  status: string;
  userId: string;
  appliedAt: string;
}
export interface IJobPopulated extends Omit<IJob, "skillsRequired"> {
  skillsRequired: ISkill[]; // fully populated
}
export interface IApplicationPopulated extends Omit<IApplication, "job"> {
  job: IJobPopulated;
}
export interface IJobWithCompanyAndSkills
  extends Omit<IJob, "skillsRequired" | "company"> {
  skillsRequired: ISkill[];
  company: Pick<ICompany, "_id" | "companyName" | "username" | "foundedYear">;
}
export class UserJobMapper {
  static toJobResponse(job: IJobPopulated): JobResponseDTO {
    return {
      id: job._id.toString(),
      title: job.title,
      description: job.description,
      location: job.location,
      jobType: job.jobType,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      skills: job.skillsRequired.map((skill) => skill.title),
      applicationDeadline: job.applicationDeadline.toISOString(),
      status: job.status,
    };
  }

  static toAppliedJobResponse(
    application: IApplicationPopulated
  ): AppliedJobResponseDTO {
    const job = application.job;

    return {
      applicationId: application._id.toString(),
      jobId: job._id.toString(),
      title: job.title,
      description: job.description,
      location: job.location,
      jobType: job.jobType,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      skills: job.skillsRequired.map((skill) => skill.title),
      applicationDeadline: job.applicationDeadline.toISOString(),
      status: application.status,
      userId: application.user.toString(),
      appliedAt: application.appliedAt.toISOString(),
    };
  }
  static toGetJobResponse(job: IJobWithCompanyAndSkills): GetJobResponseDTO {
    return {
      id: job._id.toString(),
      title: job.title,
      description: job.description,
      location: job.location,
      jobType: job.jobType,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      skills: job.skillsRequired.map((skill) => skill.title),
      salary: {
        currency: job.salary.currency,
        min: job.salary.min,
        max: job.salary.max,
        isVisibleToApplicants: job.salary.isVisibleToApplicants,
      },
      benefits: job.benefits,
      perks: job.perks,
      applicationDeadline: job.applicationDeadline.toISOString(),
      status: job.status,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
      company: {
        id: job.company._id.toString(),
        companyName: job.company.companyName,
        username: job.company.username,
        foundedYear: job.company.foundedYear.toString(),
      },
    };
  }
}
