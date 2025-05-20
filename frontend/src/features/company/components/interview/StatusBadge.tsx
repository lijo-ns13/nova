import React from "react";
import { ApplicationStatus } from "../../types/applicationTypes";
import { getStatusConfig } from "../../util/StatusUtils";

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const config = getStatusConfig(status);

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color} ${className}`}
    >
      <span>{config.label}</span>
    </div>
  );
};

export default StatusBadge;
