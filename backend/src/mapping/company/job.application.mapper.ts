import {
  ApplicantRawData,
  ApplicantSummaryDTO,
} from "../../core/dtos/company/getapplications.dto";

export const ApplicationJobMapper = {
  toApplicantSummaryDTO(raw: ApplicantRawData): ApplicantSummaryDTO {
    return {
      applicationId: raw._id,
      status: raw.status,
      appliedAt: raw.appliedAt,
      name: raw.user.name,
      profilePicture: raw.user.profilePicture ?? undefined,
      email: raw.user.email,
    };
  },
};
