import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  UserCheck,
  Award,
  FileCheck,
  FileX,
  AlertTriangle,
  CreditCard,
  UserPlus,
} from "lucide-react";
import { ApplicationStatus } from "../types/applicant";

export const getStatusIcon = (status: string) => {
  const statusMap: Record<string, React.ElementType> = {
    [ApplicationStatus.APPLIED.toLowerCase()]: Clock,
    [ApplicationStatus.SHORTLISTED.toLowerCase()]: CheckCircle,
    [ApplicationStatus.REJECTED.toLowerCase()]: XCircle,
    [ApplicationStatus.INTERVIEW_SCHEDULED.toLowerCase()]: Calendar,
    [ApplicationStatus.INTERVIEW_RESCHEDULED.toLowerCase()]: Calendar,
    [ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER.toLowerCase()]: UserCheck,
    [ApplicationStatus.INTERVIEW_REJECTED_BY_USER.toLowerCase()]: XCircle,
    [ApplicationStatus.INTERVIEW_CANCELLED.toLowerCase()]: XCircle,
    [ApplicationStatus.INTERVIEW_COMPLETED.toLowerCase()]: FileCheck,
    [ApplicationStatus.INTERVIEW_PASSED.toLowerCase()]: Award,
    [ApplicationStatus.INTERVIEW_FAILED.toLowerCase()]: FileX,
    [ApplicationStatus.OFFERED.toLowerCase()]: CreditCard,
    [ApplicationStatus.HIRED.toLowerCase()]: UserPlus,
    [ApplicationStatus.WITHDRAWN.toLowerCase()]: AlertTriangle,
    [ApplicationStatus.SELECTED.toLowerCase()]: CheckCircle,
  };

  return statusMap[status.toLowerCase()] || Clock;
};

export const getStatusColor = (status: string) => {
  const colorMap: Record<
    string,
    { bgLight: string; bg: string; text: string }
  > = {
    [ApplicationStatus.APPLIED.toLowerCase()]: {
      bgLight: "bg-blue-50",
      bg: "bg-blue-600",
      text: "text-blue-600",
    },
    [ApplicationStatus.SHORTLISTED.toLowerCase()]: {
      bgLight: "bg-green-50",
      bg: "bg-green-600",
      text: "text-green-600",
    },
    [ApplicationStatus.REJECTED.toLowerCase()]: {
      bgLight: "bg-red-50",
      bg: "bg-red-600",
      text: "text-red-600",
    },
    [ApplicationStatus.INTERVIEW_SCHEDULED.toLowerCase()]: {
      bgLight: "bg-purple-50",
      bg: "bg-purple-600",
      text: "text-purple-600",
    },
    [ApplicationStatus.INTERVIEW_RESCHEDULED.toLowerCase()]: {
      bgLight: "bg-amber-50",
      bg: "bg-amber-600",
      text: "text-amber-600",
    },
    [ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER.toLowerCase()]: {
      bgLight: "bg-blue-50",
      bg: "bg-blue-600",
      text: "text-blue-600",
    },
    [ApplicationStatus.INTERVIEW_REJECTED_BY_USER.toLowerCase()]: {
      bgLight: "bg-red-50",
      bg: "bg-red-600",
      text: "text-red-600",
    },
    [ApplicationStatus.INTERVIEW_CANCELLED.toLowerCase()]: {
      bgLight: "bg-red-50",
      bg: "bg-red-600",
      text: "text-red-600",
    },
    [ApplicationStatus.INTERVIEW_COMPLETED.toLowerCase()]: {
      bgLight: "bg-blue-50",
      bg: "bg-blue-600",
      text: "text-blue-600",
    },
    [ApplicationStatus.INTERVIEW_PASSED.toLowerCase()]: {
      bgLight: "bg-green-50",
      bg: "bg-green-600",
      text: "text-green-600",
    },
    [ApplicationStatus.INTERVIEW_FAILED.toLowerCase()]: {
      bgLight: "bg-red-50",
      bg: "bg-red-600",
      text: "text-red-600",
    },
    [ApplicationStatus.OFFERED.toLowerCase()]: {
      bgLight: "bg-blue-50",
      bg: "bg-blue-600",
      text: "text-blue-600",
    },
    [ApplicationStatus.HIRED.toLowerCase()]: {
      bgLight: "bg-green-50",
      bg: "bg-green-600",
      text: "text-green-600",
    },
    [ApplicationStatus.WITHDRAWN.toLowerCase()]: {
      bgLight: "bg-amber-50",
      bg: "bg-amber-600",
      text: "text-amber-600",
    },
    [ApplicationStatus.SELECTED.toLowerCase()]: {
      bgLight: "bg-green-50",
      bg: "bg-green-600",
      text: "text-green-600",
    },
  };

  return (
    colorMap[status.toLowerCase()] || {
      bgLight: "bg-slate-50",
      bg: "bg-slate-600",
      text: "text-slate-600",
    }
  );
};
