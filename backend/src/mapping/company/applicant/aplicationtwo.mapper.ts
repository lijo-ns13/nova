import { z } from "zod";
import { ApplicationStatus } from "../../../core/enums/applicationStatus";
import { IApplication } from "../../../models/application.modal";
import { Types } from "mongoose";

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
  username?: string;
  name?: string;
  userProfilePicture?: string;
  status: ApplicationStatus;
  resumeUrl?: string;
  appliedAt: Date;
  scheduledAt?: Date;
  reason?: string;
  coverLetter?: string;
  statusHistory?: {
    status: ApplicationStatus;
    reason?: string;
    updatedAt: Date;
  }[];
}
export type PopulatedApplication = Omit<IApplication, "user" | "job"> & {
  user: {
    _id: string | Types.ObjectId;
    name: string;
    profilePicture?: string;
    username?: string;
  };
  job: {
    _id: string | Types.ObjectId;
    title: string;
    company: string;
  };
};
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

  static toUserAndJobDTO(
    application: PopulatedApplication,
    newProfilePictureSignedUrl: string
  ): ApplicationResponseDTO {
    return {
      id: application._id.toString(),
      jobId: application.job._id.toString(),
      jobTitle: application.job.title,
      companyName: application.job.company,
      userId: application.user._id.toString(),
      username: application.user.username,
      name: application.user.name,
      userProfilePicture: newProfilePictureSignedUrl,
      status: application.status,
      appliedAt: application.appliedAt,
      scheduledAt: application.scheduledAt,
      coverLetter: application.coverLetter,
      statusHistory: application.statusHistory?.map((entry) => ({
        status: entry.status,
        reason: entry.reason,
        updatedAt: entry.changedAt,
      })),
    };
  }
}
