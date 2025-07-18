import { ApplicationStatus } from "../types/applicant";

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon?: string;
}

export const getStatusConfig = (status: ApplicationStatus): StatusConfig => {
  switch (status) {
    case ApplicationStatus.APPLIED:
      return {
        label: "Applied",
        color: "text-blue-700",
        bgColor: "bg-blue-100",
      };
    case ApplicationStatus.SHORTLISTED:
      return {
        label: "Shortlisted",
        color: "text-purple-700",
        bgColor: "bg-purple-100",
      };
    case ApplicationStatus.REJECTED:
      return {
        label: "Rejected",
        color: "text-red-700",
        bgColor: "bg-red-100",
      };
    case ApplicationStatus.INTERVIEW_SCHEDULED:
      return {
        label: "Interview Scheduled",
        color: "text-yellow-700",
        bgColor: "bg-yellow-100",
      };
    case ApplicationStatus.INTERVIEW_CANCELLED:
      return {
        label: "Interview Cancelled",
        color: "text-gray-700",
        bgColor: "bg-gray-100",
      };
    case ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER:
      return {
        label: "Interview Accepted",
        color: "text-green-700",
        bgColor: "bg-green-100",
      };
    case ApplicationStatus.INTERVIEW_REJECTED_BY_USER:
      return {
        label: "Interview Rejected",
        color: "text-red-700",
        bgColor: "bg-red-100",
      };
    case ApplicationStatus.INTERVIEW_FAILED:
      return {
        label: "Interview Failed",
        color: "text-red-700",
        bgColor: "bg-red-100",
      };
    case ApplicationStatus.INTERVIEW_PASSED:
      return {
        label: "Interview Passed",
        color: "text-green-700",
        bgColor: "bg-green-100",
      };
    case ApplicationStatus.OFFERED:
      return {
        label: "Offer Made",
        color: "text-indigo-700",
        bgColor: "bg-indigo-100",
      };
    case ApplicationStatus.SELECTED:
      return {
        label: "Selected",
        color: "text-emerald-700",
        bgColor: "bg-emerald-100",
      };
    case ApplicationStatus.WITHDRAWN:
      return {
        label: "Withdrawn",
        color: "text-gray-700",
        bgColor: "bg-gray-100",
      };
    default:
      return {
        label: "Unknown",
        color: "text-gray-700",
        bgColor: "bg-gray-100",
      };
  }
};

export const getStatusMessage = (
  status: ApplicationStatus,
  reason?: string
): string => {
  switch (status) {
    case ApplicationStatus.REJECTED:
      return reason ? `Reason: ${reason}` : "Application was rejected.";
    case ApplicationStatus.INTERVIEW_SCHEDULED:
      return "Interview has been scheduled. Please check your email for details.";
    case ApplicationStatus.INTERVIEW_CANCELLED:
      return "Interview has been cancelled by the company.";
    case ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER:
      return "Applicant has accepted the interview.";
    case ApplicationStatus.INTERVIEW_REJECTED_BY_USER:
      return "Applicant rejected the interview invitation.";
    case ApplicationStatus.INTERVIEW_FAILED:
      return "Interview was not successful.";
    case ApplicationStatus.INTERVIEW_PASSED:
      return "Interview was successful.";
    case ApplicationStatus.OFFERED:
      return "Offer has been made to the applicant.";
    case ApplicationStatus.SELECTED:
      return "Applicant has been selected for the job.";
    case ApplicationStatus.WITHDRAWN:
      return "Application was withdrawn by the applicant.";
    default:
      return "";
  }
};
