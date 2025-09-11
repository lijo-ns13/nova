import { ApplicationStatus } from "../core/enums/applicationStatus";

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
    ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER,
    ApplicationStatus.INTERVIEW_REJECTED_BY_USER,
    ApplicationStatus.INTERVIEW_RESCHEDULE_PROPOSED,
    ApplicationStatus.INTERVIEW_CANCELLED,
  ],
  [ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER]: [
    ApplicationStatus.INTERVIEW_RESCHEDULE_PROPOSED,
    ApplicationStatus.INTERVIEW_COMPLETED,
    ApplicationStatus.INTERVIEW_CANCELLED,
  ],
  [ApplicationStatus.INTERVIEW_RESCHEDULE_PROPOSED]: [
    ApplicationStatus.INTERVIEW_RESCHEDULE_ACCEPTED,
    ApplicationStatus.INTERVIEW_RESCHEDULE_REJECTED,
  ],
  [ApplicationStatus.INTERVIEW_RESCHEDULE_ACCEPTED]: [
    ApplicationStatus.INTERVIEW_PASSED,
    ApplicationStatus.INTERVIEW_FAILED,
    ApplicationStatus.INTERVIEW_COMPLETED,
    ApplicationStatus.INTERVIEW_CANCELLED,
  ],
  [ApplicationStatus.INTERVIEW_RESCHEDULE_REJECTED]: [
    // When reschedule is rejected, it could go back to scheduled or cancelled
    // ApplicationStatus.INTERVIEW_SCHEDULED,
    ApplicationStatus.INTERVIEW_CANCELLED,
  ],
  [ApplicationStatus.INTERVIEW_COMPLETED]: [
    ApplicationStatus.INTERVIEW_PASSED,
    ApplicationStatus.INTERVIEW_FAILED,
  ],
  [ApplicationStatus.INTERVIEW_PASSED]: [ApplicationStatus.OFFERED],
  [ApplicationStatus.OFFERED]: [
    ApplicationStatus.SELECTED,
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
