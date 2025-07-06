import {
  JobType,
  EmploymentType,
  ExperienceLevel,
  IJob,
} from "../models/job.modal";
import {
  CreateJobRequestDTO,
  UpdateJobRequestDTO,
} from "../core/dtos/company/job.dto";

export class JobMapper {
  static toCreateEntity(dto: CreateJobRequestDTO): Partial<IJob> {
    return {
      title: dto.title,
      description: dto.description,
      location: dto.location,
      jobType: this.toJobType(dto.jobType),
      employmentType: this.toEmploymentType(dto.employmentType),
      experienceLevel: this.toExperienceLevel(dto.experienceLevel),
      company: dto.company,
      skillsRequired: dto.skillsRequired,
      salary: dto.salary,
      benefits: dto.benefits,
      perks: dto.perks,
      applicationDeadline: dto.applicationDeadline,
    };
  }

  static toUpdateEntity(dto: UpdateJobRequestDTO): Partial<IJob> {
    return {
      ...(dto.title && { title: dto.title }),
      ...(dto.description && { description: dto.description }),
      ...(dto.location && { location: dto.location }),
      ...(dto.jobType && { jobType: this.toJobType(dto.jobType) }),
      ...(dto.employmentType && {
        employmentType: this.toEmploymentType(dto.employmentType),
      }),
      ...(dto.experienceLevel && {
        experienceLevel: this.toExperienceLevel(dto.experienceLevel),
      }),
      ...(dto.company && { company: dto.company }),
      ...(dto.skillsRequired && { skillsRequired: dto.skillsRequired }),
      ...(dto.salary && { salary: dto.salary }),
      ...(dto.benefits && { benefits: dto.benefits }),
      ...(dto.perks && { perks: dto.perks }),
      ...(dto.applicationDeadline && {
        applicationDeadline: dto.applicationDeadline,
      }),
    };
  }

  private static toJobType(val: string): JobType {
    const map: Record<string, JobType> = {
      remote: JobType.REMOTE,
      hybrid: JobType.HYBRID,
      "on-site": JobType.ON_SITE,
    };
    return map[val];
  }

  private static toEmploymentType(val: string): EmploymentType {
    const map: Record<string, EmploymentType> = {
      "full-time": EmploymentType.FULL_TIME,
      "part-time": EmploymentType.PART_TIME,
      contract: EmploymentType.CONTRACT,
      temporary: EmploymentType.TEMPORARY,
      internship: EmploymentType.INTERNSHIP,
      freelance: EmploymentType.FREELANCE,
    };
    return map[val];
  }

  private static toExperienceLevel(val: string): ExperienceLevel {
    const map: Record<string, ExperienceLevel> = {
      entry: ExperienceLevel.ENTRY,
      mid: ExperienceLevel.MID,
      senior: ExperienceLevel.SENIOR,
      lead: ExperienceLevel.LEAD,
    };
    return map[val];
  }
}
