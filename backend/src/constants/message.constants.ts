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
  COMPANY_NOT_FOUND: "company not found",
  INTERVIEW_NOT_FOUND: "Interview nto found for this application",
  APPLICATION_FAILED_UPDATE: "Appliation failed updation",
  ADMIN_NOT_FOUND: "Admin not found",
  INVALID_PASSWORD: "Invalid password",
  SKILL_ALREADY_EXISTS: "skill already exists",
  SKILL_NOT_FOUND: "skill not found",
  FAILED_TO_DELETE_SKILL: "failed to delete skill",
  FETCHING_SKILLS: "fetching skills list",
  FETCHING_SKILL_BYID: "fetching skill byid",
  ALREADY_BLOCKED: "Already blocked",
  ALREADY_UNBLOCKED: "Already unblocked",
  USER_NOT_UPDATED: "User not updated",
  INVALID_PAGINATION_VALUES: "invalid pagination values",
  FEATURE: {
    NOT_DELETED: "Feature not deleted",
    NOT_UPDATED: "Feature not updated",
    NOT_FOUND: "Feature not found",
  },
  SUB: {
    NOT_FOUND: "Subscription plan not found",
  },
};

export const USER_INTERVIEW_MESSAGES = {
  USER_RESPONSE_INTERVIEW: "Only user can accept or reject interview",
  NO_RESCHEDULE_FOUND: "No reschedule proposal found",
  SELECTED_SLOTS_REQUIRED:
    "Selected slot is required when accepting reschedule",
  SELECTED_SLOT_MISMATCH: "Selected slot is not one of the proposed slots",
  INVALID_STATUS_RESCHEDULE_RESPONSE: "Invalid status for reschedule response",
};

export const ADMIN_MESSAGES = {
  ADMIN_SIGNIN: "admin signin succesfully",
  COMPANY: {
    COMPANY_FETCHED: "company data fetched successfully",
    VERIFIED_SUCCESSFULLY: (status: string) =>
      `Company ${status} successufully`,
    UNVERIFED_COMPANIES_FETCHED: "Unverified companies fetched successfully",
    BLOCK_COMPANY: "Company blocked successfully",
    UNBLOCK_COMPANY: "Company unblocked successfully",
    FETCH_COMPANIES: "Companies fetched successfully",
  },
  SKILL: {
    CREATED: "Skill created successfully",
    UPDATED: "Skill updated successfully",
    DELETED: "Skill deleted successfully",
  },
  USER: {
    BLOCKED: "User blocked successfully",
    UNBLOCKED: "User unblocked successfully",
    FETCH_USERS: "Users fetched successfully",
    FETCH_SEARCHED_USERS: "Search results fetched successfully",
  },
  FEATURE: {
    CREATED: "Feature created successfully",
    UPDATED: "Feature updated successfully",
    DELETED: "Feature deleted successfully",
    FETCH_ALL: "succesfully fetched all features",
    FETCH_BYID: "successfully fetch feature",
  },
  SUBSCRIPTION: {
    FETCH_FILTERED_TRANSACTIONS: "Transactions fetched",
    CREATED: "Subscription plan created successfully",
    UPDATED: "Subscription plan updated successfully",
    DELETED: "Subscription plan deleted successfully",
    FETCH_ALL: "All subscription plans fetched successfully",
    FETCH_ONE: "Subscription plan fetched successfully",
    TOGGLE_STATUS: "Subscription plan status updated",
  },
};
export const ADMIN_CONTROLLER_ERROR = {
  SIGNIN_ERROR: "AdminAuthController.signIn",
  GET_COMPANY_ERROR: "AdminCompanyManagementController.getCompanyById",
  VERIFY_COMPANY_ERROR: "AdminCompanyManagementController.verifyCompany",
  GET_UNVERIFIED_COMPANIES_ERROR:
    "AdminCompanyManagementController.getUnverifiedCompaniesHandler",
  BLOCK_COMPANY_ERROR: "AdminCompanyManagementController.blockcompany",
  UNBLOCK_COMPANY_ERROR: "AdminCompanyManagementController.unblockcomapny",
  GET_COMPANIES_ERROR: "AdminCompanyManagementController.getcompanies",
  CREATE_SKILL_ERROR: "AdminSkillController.create",
  UPDATE_SKILL_ERROR: "AdminSkillController.update",
  DELETE_SKILL_ERROR: "AdminSkillController.delete",
  GETALL_SKILL_ERROR: "AdminSkillController.getAll",
  GETBYID_SKILL_ERROR: "AdminSkillController.getById",
  BLOCK_USER: "AdminUserManagementController.blockUser",
  UNBLOCK_USER: "AdminUserManagementController.unblockuser",
  FETCH_USERS: "AdminUserManagementController.getUsers",
  CREATE_FEATURE: "FeatureController.create",
  UPDATE_FEATURE: "FeatureController.update",
  DELETE_FEATURE: "FeatureController.delete",
  FETCHALL_FEATURE: "FeatureController.getall",
  FETCH_FEATURE: "FeatureController.getbyid",
  SUB: {
    FETCH_FILTERED: "getFilteredTransactions",
    CREATE: "SubscriptionPlanController.createPlan",
    UPDATE: "SubscriptionPlanController.updatePlan",
    DELETE: "SubscriptionPlanController.DELETEPLAN",
    FETCH_ALL: "SubscriptionPlanController.FETCHALL",
    FETCH_ONE: "SubscriptionPlanController.GETBYID",
    TOGGLE_STATUS: "SubscriptionPlanController.TOGGLESTATUS",
  },
};
