import React from "react";

const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-24 h-24 rounded-full bg-gray-200"></div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="h-7 bg-gray-200 rounded w-48 mx-auto sm:mx-0"></div>
            <div className="h-5 bg-gray-200 rounded w-32 mx-auto sm:mx-0"></div>
            <div className="h-6 bg-gray-200 rounded-full w-28 mt-3 mx-auto sm:mx-0"></div>
          </div>
        </div>
      </div>

      {/* Job Info Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
        <div className="h-5 bg-gray-200 rounded w-48"></div>
      </div>

      {/* Resume Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex-1 w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-200 rounded-md w-9 h-9"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
                <div className="h-3 bg-gray-200 rounded w-16 mt-2"></div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="h-10 bg-gray-200 rounded w-28 flex-1 sm:flex-initial"></div>
            <div className="h-10 bg-gray-200 rounded w-28 flex-1 sm:flex-initial"></div>
          </div>
        </div>
      </div>

      {/* Status Actions Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-20 bg-gray-200 rounded mb-4"></div>
        <div className="flex justify-center sm:justify-start">
          <div className="h-10 bg-gray-200 rounded w-40"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
