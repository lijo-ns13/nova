export const USER_MESSAGES = {
  USER_INTERVIEW: {
    SUCCESS: {
      UPDATED: "Interview status updated",
      RESCHEDULED: "Interview reschedule status updated",
      GET_RESCHEDULED_SLOTS: "Reschedule slots retrieved",
    },
    ERROR: {
      UPDATE_FAILED: "Failed to update interview status.",
      RESCHEDULE_FAILED: "Failed to update reschedule status.",
      FETCH_SLOTS_FAILED: "Failed to retrieve reschedule slots.",
    },
  },
  JOB: {
    SUCCESS: {
      JOB_ALL_FETCH: "Jobs fetched successfully",
      JOB_FETCH: "Job fetched succesfully",
      APPLIED_JOB_FETCH: "Applied jobs fetched succesfully",
      APPLY_JOB: "Job application submitted succefully",
      CHECK_APPLICATION_STATUS: "Application status retrieved successfully",
    },
    ERROR: {
      FAILED_JOBALLFETCH: "UserJobController.getAllJobs",
      FAILED_JOBFETCH: "UserJobController.getJob",
      FAILED_APPLIEDJOBFETCH: "UserJobController.getAppliedJobs",
      FAILED_JOBAPPLY: "JobApplicationController.applyToJob",
      FAILED_CHECK_APPLICATION_STATUS: "checkApplicationStatus",
    },
  },
};

export const COMMON_MESSAGES = {
  NOT_AUTHORIZED: "User not authenticated",
  RESUME_FILE_REQUIRED: "Resume file is required",
  ONLY_PDF: "Only PDF files are accepted for resumes",
  USER_NOT_FOUND: "User not found",
  USERID_NOT_FOUND: "UserId not found",
  JOB_NOT_FOUND: "Job not found",
  JOBID_NOT_FOUND: " JobId not found",
  FREETIER_LIMIT_ENDED: "free tier limit ended",
  APPLICATION_NOT_FOUND: "application not found",
  COMPANYID_NOT_FOUND: "company id not found",
  INTERVIEW_NOT_FOUND: "Interview nto found for this application",
  APPLICATION_FAILED_UPDATE: "Appliation failed updation",
};

export const USER_INTERVIEW_MESSAGES = {
  USER_RESPONSE_INTERVIEW: "Only user can accept or reject interview",
  NO_RESCHEDULE_FOUND: "No reschedule proposal found",
  SELECTED_SLOTS_REQUIRED:
    "Selected slot is required when accepting reschedule",
  SELECTED_SLOT_MISMATCH: "Selected slot is not one of the proposed slots",
  INVALID_STATUS_RESCHEDULE_RESPONSE: "Invalid status for reschedule response",
};
