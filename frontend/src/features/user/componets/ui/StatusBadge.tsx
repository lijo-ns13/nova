import React from "react";
import { ApplicationStatus } from "../../../company/types/applicant";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Define badge styles by status
  const getBadgeStyles = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPLIED:
        return "bg-blue-100 text-blue-800 border-blue-300";
      case ApplicationStatus.SHORTLISTED:
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case ApplicationStatus.INTERVIEW_SCHEDULED:
      case ApplicationStatus.INTERVIEW_RESCHEDULED:
        return "bg-purple-100 text-purple-800 border-purple-300";
      case ApplicationStatus.REJECTED:
      case ApplicationStatus.WITHDRAWN:
        return "bg-red-100 text-red-800 border-red-300";
      case ApplicationStatus.INTERVIEW_CANCELLED:
        return "bg-gray-100 text-gray-800 border-gray-300";
      case ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER:
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case ApplicationStatus.INTERVIEW_REJECTED_BY_USER:
        return "bg-orange-100 text-orange-800 border-orange-300";
      case ApplicationStatus.INTERVIEW_FAILED:
        return "bg-red-100 text-red-800 border-red-300";
      case ApplicationStatus.INTERVIEW_PASSED:
      case ApplicationStatus.SELECTED:
        return "bg-green-100 text-green-800 border-green-300";
      case ApplicationStatus.OFFERED:
        return "bg-amber-100 text-amber-800 border-amber-300";
      case ApplicationStatus.HIRED:
        return "bg-green-200 text-green-900 border-green-400";
      case ApplicationStatus.INTERVIEW_COMPLETED:
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Format display text from status
  const formatStatusText = (status: ApplicationStatus) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBadgeStyles(
        status
      )}`}
    >
      {formatStatusText(status)}
    </span>
  );
};

export default StatusBadge;
