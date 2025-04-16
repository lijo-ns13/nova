import React from "react";

type Status = "pending" | "reviewed" | "interview" | "rejected" | "accepted";

interface StatusBadgeProps {
  status: Status;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewed: "bg-blue-100 text-blue-800",
  interview: "bg-purple-100 text-purple-800",
  rejected: "bg-red-100 text-red-800",
  accepted: "bg-green-100 text-green-800",
};

const statusLabels = {
  pending: "Pending",
  reviewed: "Under Review",
  interview: "Interview",
  rejected: "Not Selected",
  accepted: "Accepted",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
};

export default StatusBadge;
