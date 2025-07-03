export enum ApplicationStatus {
  APPLIED = "applied",
  SHORTLISTED = "shortlisted",
  INTERVIEW_SCHEDULED = "interview_scheduled",
  INTERVIEW_RESCHEDULED = "interview_rescheduled",
  INTERVIEW_ACCEPTED_BY_USER = "interview_accepted_by_user",
  INTERVIEW_REJECTED_BY_USER = "interview_rejected_by_user",
  INTERVIEW_RESCHEDULE_PROPOSED = "interview_reschedule_proposed",
  INTERVIEW_RESCHEDULE_ACCEPTED = "interview_reschedule_accepted",
  INTERVIEW_RESCHEDULE_REJECTED = "interview_reschedule_rejected",
  INTERVIEW_CANCELLED = "interview_cancelled",
  INTERVIEW_COMPLETED = "interview_completed",
  INTERVIEW_PASSED = "interview_passed",
  INTERVIEW_FAILED = "interview_failed",
  OFFERED = "offered",
  HIRED = "hired",
  SELECTED = "selected",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

export interface Job {
  title: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    isVisibleToApplicants: boolean;
  };
}

export interface User {
  _id: string;
  name: string;
  username: string;
  profilePicture: string;
}

export interface StatusHistoryItem {
  status: string;
  changedAt: string;
  reason?: string;
}

export interface Applicant {
  job: Job;
  user: User;
  resumeUrl?: string;
  resumeMediaId?: string;
  status: string;
  appliedAt: string;
  statusHistory: StatusHistoryItem[];
  updatedAt?: string;
  createdAt?: string;
  scheduledAt?: string;
}
