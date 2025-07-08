import { z } from "zod";
import { ApplicationStatus } from "../../../core/enums/applicationStatus";
import { IApplication } from "../../../models/application.modal";

export const UpdateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
  reason: z.string().max(1000).optional(),
});

export type UpdateApplicationStatusInput = z.infer<
  typeof UpdateApplicationStatusSchema
>;

export interface ApplicationResponseDTO {
  id: string;
  jobId: string;
  jobTitle?: string;
  companyName?: string;
  userId: string;
  userName?: string;
  userProfilePicture?: string;
  status: ApplicationStatus;
  resumeUrl?: string;
  appliedAt: Date;
  scheduledAt?: Date;
  reason?: string;
  coverLetter?: string;
}

export class ApplicationMapper {
  static toDTO(
    application: IApplication & { resumeUrl?: string }
  ): ApplicationResponseDTO {
    return {
      id: application._id.toString(),
      jobId: application.job.toString(),
      userId: application.user.toString(),
      status: application.status,
      resumeUrl: application.resumeUrl,
      appliedAt: application.appliedAt,
      scheduledAt: application.scheduledAt,
      coverLetter: application.coverLetter,
    };
  }

  static toUserAndJobDTO(application: any): ApplicationResponseDTO {
    return {
      id: application._id.toString(),
      jobId: application.job._id.toString(),
      jobTitle: application.job.title,
      companyName: application.job.company,
      userId: application.user._id.toString(),
      userName: application.user.name,
      userProfilePicture: application.user.profilePicture,
      status: application.status,
      appliedAt: application.appliedAt,
      scheduledAt: application.scheduledAt,
      coverLetter: application.coverLetter,
    };
  }
}
