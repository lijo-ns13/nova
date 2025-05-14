import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "applied" | "shortlisted" | "rejected";
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
      default:
        return {
          icon: <Clock size={16} />,
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
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
