export const COMPANY_INTERVIEW_ROUTES = {
  UPCOMING: "/upcoming",
  RESCHEDULE: "/:applicationId/reschedule",
};
export const COMPANY_JOB_ROUTES = {
  ROOT: "/",
  BY_ID: "/:jobId",
  APPLICANTS: "/:jobId/applicants",
  APPLICATION_DETAILS: "/application/:applicationId/details",
  SHORTLIST: "/shortlist/:applicationId",
  REJECT: "/reject/:applicationId",
};
export const JOB_APPLICANT_ROUTES = {
  BY_ID: "/:applicationId",
  STATUS: "/:applicationId/status",
};
export const COMPANY_ROUTES = {
  JOB: "/job",
  PROFILE: "/profile",
  INTERVIEW: "/interview",
  APPLICANT: "/applicant",
  DASHBOARD: "/", // default dashboard
} as const;
