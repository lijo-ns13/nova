// src/core/mappers/ApplicationMapper.ts

import { ApplicantDetailDTO } from "../../core/dtos/company/getApplicant.dto";
import { PopulatedApplicationWithUserAndResume } from "../../repositories/mongo/JobRepository";

export class ApplicationGetMapper {
  static toDetailDTO(
    application: PopulatedApplicationWithUserAndResume,
    resumeUrl: string | null
  ): ApplicantDetailDTO {
    return {
      id: application._id.toString(),
      appliedAt: application.appliedAt,
      coverLetter: application.coverLetter,
      status: application.status,
      scheduledAt: application.scheduledAt,
      resumeUrl,
      user: {
        id: application.user._id.toString(),
        name: application.user.name,
        email: application.user.email,
        username: application.user.username,
        profilePicture: application.user.profilePicture,
        headline: application.user.headline,
      },
      statusHistory: application.statusHistory.map((entry) => ({
        status: entry.status,
        changedAt: entry.changedAt,
        reason: entry.reason,
      })),
    };
  }
}
