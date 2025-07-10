import { IApplication } from "../../models/application.modal";

export interface ApplicationStatusResponseDTO {
  id: string;
  user: string;
  job: string;
  appliedAt: string;
  scheduledAt?: string;
  statusHistory: {
    status: string;
    changedAt: string;
    reason?: string;
  }[];
}

export class ApplicationMapper {
  static toStatusResponseDTO(
    application: IApplication
  ): ApplicationStatusResponseDTO {
    return {
      id: application._id.toString(),
      user: application.user.toString(),
      job: application.job.toString(),
      appliedAt: application.appliedAt.toISOString(),
      scheduledAt: application.scheduledAt?.toISOString(),
      statusHistory: application.statusHistory.map((entry) => ({
        status: entry.status,
        changedAt: entry.changedAt.toISOString(),
        reason: entry.reason,
      })),
    };
  }
}
