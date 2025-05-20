import React from "react";

type StatusType =
  | "applied"
  | "shortlisted"
  | "interview_scheduled"
  | "rejected"
  | "interview_cancelled"
  | "interview_accepted_by_user"
  | "interview_rejected_by_user"
  | "interview_failed"
  | "interview_passed"
  | "offered"
  | "selected";

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Define badge styles by status
  const getBadgeStyles = (status: StatusType) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "shortlisted":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "interview_scheduled":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "interview_cancelled":
        return "bg-gray-100 text-gray-800 border-gray-300";
      case "interview_accepted_by_user":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "interview_rejected_by_user":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "interview_failed":
        return "bg-red-100 text-red-800 border-red-300";
      case "interview_passed":
        return "bg-green-100 text-green-800 border-green-300";
      case "offered":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "selected":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Format display text from status
  const formatStatusText = (status: StatusType) => {
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
