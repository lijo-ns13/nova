import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PaginationState } from "../../types/jobTypes";

interface PaginationProps {
  pagination: PaginationState;
  handlePageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  handlePageChange,
}) => {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between">
      <div className="text-sm text-gray-500 mb-4 sm:mb-0">
        Showing page {pagination.page} of {pagination.totalPages} •{" "}
        {pagination.total} total jobs
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className={`px-3 py-1 rounded-md border ${
            pagination.page === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
          let pageNum;
          if (pagination.totalPages <= 5) {
            pageNum = i + 1;
          } else if (pagination.page <= 3) {
            pageNum = i + 1;
          } else if (pagination.page >= pagination.totalPages - 2) {
            pageNum = pagination.totalPages - 4 + i;
          } else {
            pageNum = pagination.page - 2 + i;
          }

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 rounded-md border ${
                pagination.page === pageNum
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className={`px-3 py-1 rounded-md border ${
            pagination.page === pagination.totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
