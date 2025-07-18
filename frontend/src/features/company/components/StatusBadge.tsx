import React from "react";
import {
  CheckCircle,
  Clock,
  XCircle,
  CalendarCheck,
  CalendarX,
  Handshake,
  ThumbsDown,
  ThumbsUp,
  Briefcase,
  Star,
  MinusCircle,
  HelpCircle,
} from "lucide-react";

interface StatusBadgeProps {
  status:
    | "applied"
    | "shortlisted"
    | "rejected"
    | "interview_scheduled"
    | "interview_cancelled"
    | "interview_accepted_by_user"
    | "interview_rejected_by_user"
    | "interview_reschedule_proposed"
    | "interview_reschedule_accepted"
    | "interview_reschedule_rejected"
    | "interview_completed"
    | "interview_passed"
    | "interview_failed"
    | "offered"
    | "selected"
    | "hired"
    | "withdrawn";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "applied":
        return {
          icon: <Clock size={16} />,
          bgColor: "bg-blue-50",
          textColor: "text-blue-700",
          label: "Applied",
        };
      case "shortlisted":
        return {
          icon: <CheckCircle size={16} />,
          bgColor: "bg-green-50",
          textColor: "text-green-700",
          label: "Shortlisted",
        };
      case "rejected":
        return {
          icon: <XCircle size={16} />,
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          label: "Rejected",
        };
      case "interview_scheduled":
        return {
          icon: <CalendarCheck size={16} />,
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-700",
          label: "Interview Scheduled",
        };
      case "interview_cancelled":
        return {
          icon: <CalendarX size={16} />,
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          label: "Interview Cancelled",
        };
      case "interview_accepted_by_user":
        return {
          icon: <Handshake size={16} />,
          bgColor: "bg-indigo-50",
          textColor: "text-indigo-700",
          label: "Interview Accepted",
        };
      case "interview_rejected_by_user":
        return {
          icon: <XCircle size={16} />,
          bgColor: "bg-orange-50",
          textColor: "text-orange-700",
          label: "Interview Rejected",
        };
      case "interview_failed":
        return {
          icon: <ThumbsDown size={16} />,
          bgColor: "bg-red-100",
          textColor: "text-red-700",
          label: "Interview Failed",
        };
      case "interview_passed":
        return {
          icon: <ThumbsUp size={16} />,
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          label: "Interview Passed",
        };
      case "offered":
        return {
          icon: <Briefcase size={16} />,
          bgColor: "bg-purple-50",
          textColor: "text-purple-700",
          label: "Offered",
        };
      case "selected":
        return {
          icon: <Star size={16} />,
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          label: "Selected",
        };
      case "withdrawn":
        return {
          icon: <MinusCircle size={16} />,
          bgColor: "bg-gray-200",
          textColor: "text-gray-700",
          label: "Withdrawn",
        };
      default:
        return {
          icon: <HelpCircle size={16} />,
          bgColor: "bg-gray-100",
          textColor: "text-gray-600",
          label: "Unknown",
        };
    }
  };

  const { icon, bgColor, textColor, label } = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};

export default StatusBadge;
