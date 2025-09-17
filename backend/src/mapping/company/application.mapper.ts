import {
  ApplicationResponseDto,
  IApplicationWithUserAndJob,
} from "../../core/dtos/company/application.dto";
import { IApplication } from "../../repositories/entities/application.entity";

export interface IApplicationPopulated {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
  };
  user: {
    _id: string;
    name: string;
    username: string;
    profilePicture?: string;
  };
}
export const ApplicationMapper = {
  toDto(app: IApplication, resumeUrl?: string): ApplicationResponseDto {
    return {
      id: app._id.toString(),
      jobId: typeof app.job === "string" ? app.job : app.job._id.toString(),
      userId: typeof app.user === "string" ? app.user : app.user._id.toString(),
      appliedAt: app.appliedAt,
      resumeUrl,
      coverLetter: app.coverLetter,
      status: app.status,
      notes: app.notes,
      scheduledAt: app.scheduledAt,
      statusHistory: app.statusHistory,
    };
  },
  toUserAndJobDTO(data: IApplicationPopulated): IApplicationWithUserAndJob {
    return {
      id: data._id,
      user: {
        id: data.user._id,
        name: data.user.name,
        username: data.user.username,
        profilePicture: data.user.profilePicture,
      },
      job: {
        id: data.job._id,
        title: data.job.title,
        companyId: data.job.company,
      },
    };
  },
};
// src/modules/application/mappers/ApplicationMapper.ts

// import { IApplicationPopulated } from "../types/application.types";
// import { IApplicationWithUserAndJob } from "../dtos/ApplicationWithUserAndJob.dto";

// export class ApplicationMapper {

// }
