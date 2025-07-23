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
};
