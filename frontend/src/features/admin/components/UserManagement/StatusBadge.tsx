import React from "react";

interface StatusBadgeProps {
  isBlocked: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ isBlocked }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isBlocked
          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      }`}
    >
      <span
        className={`mr-1.5 h-2 w-2 rounded-full ${
          isBlocked ? "bg-red-500" : "bg-green-500"
        }`}
      ></span>
      {isBlocked ? "Blocked" : "Active"}
    </span>
  );
};

export default StatusBadge;
