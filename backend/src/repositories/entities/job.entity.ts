import { Document, Types } from "mongoose";
import { EmploymentType } from "../../constants/employeeType.constant";
import { JobType } from "../../constants/job.constant";
import { ExperienceLevel } from "../../constants/experience.constant";
import { SalaryRange } from "../../constants/salaryrange.constant";

export interface IJob extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  location: string;
  jobType: JobType;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  company: Types.ObjectId;
  skillsRequired: Types.ObjectId[];
  salary: SalaryRange;
  benefits: string[];
  perks?: string[];
  applicationDeadline: Date;
  status: "open" | "closed" | "filled";
  createdAt: Date;
  updatedAt: Date;
}
