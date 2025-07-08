// src/modules/job/mappers/JobMapper.ts

import { JobResponseDto } from "../core/dtos/company/job.dto";
import { ICompany } from "../models/company.modal";
import { IJob } from "../models/job.modal";
import { ISkill } from "../models/skill.modal";
export interface IJobWithSkills extends Omit<IJob, "skillsRequired"> {
  skillsRequired: ISkill[];
}

export const JobMapper = {
  toResponseDto(job: IJob): JobResponseDto {
    return {
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
      skillsRequired: job.skillsRequired.map((s) => s.toString()),
      applicationDeadline: job.applicationDeadline,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  },
  toResponseWithSkillDto(job: IJobWithSkills): JobResponseDto {
    return {
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
      skillsRequired: job.skillsRequired.map((skill) => skill.title.toString()),

      applicationDeadline: job.applicationDeadline,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  },
};
