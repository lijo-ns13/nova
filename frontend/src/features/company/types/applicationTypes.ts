// export enum ApplicationStatus {
//   APPLIED = "applied",
//   SHORTLISTED = "shortlisted",
//   REJECTED = "rejected",
//   INTERVIEW_SCHEDULED = "interview_scheduled",
//   INTERVIEW_CANCELLED = "interview_cancelled",
//   INTERVIEW_ACCEPTED_BY_USER = "interview_accepted_by_user",
//   INTERVIEW_REJECTED_BY_USER = "interview_rejected_by_user",
//   INTERVIEW_FAILED = "interview_failed",
//   INTERVIEW_PASSED = "interview_passed",
//   OFFERED = "offered",
//   SELECTED = "selected",
//   WITHDRAWN = "withdrawn",
// }

// export interface UserDetails {
//   _id: string;
//   name: string;
//   username: string;
//   profilePicture: string | null;
// }

// export interface JobDetails {
//   _id: string;
//   title: string;
// }

// export interface Application {
//   scheduledAt: Date;
//   _id: string;
//   resumeUrl: string;
//   status: ApplicationStatus;
//   appliedAt: string;
//   user: UserDetails;
//   job: JobDetails;
//   rejectionReason?: string;
// }
