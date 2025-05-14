import React from "react";
import { Filter } from "lucide-react";

interface EmptyStateProps {
  hasFilters: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasFilters }) => {
  return (
    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 p-4 rounded-full">
          <Filter className="h-8 w-8 text-gray-400" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No applicants found
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        {hasFilters
          ? "Try changing your search criteria or filters"
          : "This job position has no applicants yet"}
      </p>
    </div>
  );
};

export default EmptyState;
