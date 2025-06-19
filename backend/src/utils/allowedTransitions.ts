import { ApplicationStatus } from "../models/application.modal";

export const allowedTransitions: Record<
  ApplicationStatus,
  ApplicationStatus[]
> = {
  [ApplicationStatus.APPLIED]: [
    ApplicationStatus.SHORTLISTED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
  ],
  [ApplicationStatus.SHORTLISTED]: [
    ApplicationStatus.INTERVIEW_SCHEDULED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
  ],
  [ApplicationStatus.INTERVIEW_SCHEDULED]: [
    ApplicationStatus.INTERVIEW_CANCELLED,
    ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER,
    ApplicationStatus.INTERVIEW_REJECTED_BY_USER,
  ],
  [ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER]: [
    ApplicationStatus.INTERVIEW_COMPLETED,
  ],
  [ApplicationStatus.INTERVIEW_COMPLETED]: [
    ApplicationStatus.INTERVIEW_PASSED,
    ApplicationStatus.INTERVIEW_FAILED,
  ],
  [ApplicationStatus.INTERVIEW_PASSED]: [ApplicationStatus.OFFERED],
  [ApplicationStatus.OFFERED]: [
    ApplicationStatus.HIRED,
    ApplicationStatus.WITHDRAWN,
  ],
  [ApplicationStatus.INTERVIEW_REJECTED_BY_USER]: [],
  [ApplicationStatus.INTERVIEW_CANCELLED]: [],
  [ApplicationStatus.INTERVIEW_FAILED]: [],
  [ApplicationStatus.REJECTED]: [],
  [ApplicationStatus.WITHDRAWN]: [],
  [ApplicationStatus.HIRED]: [],
  [ApplicationStatus.SELECTED]: [],
};
