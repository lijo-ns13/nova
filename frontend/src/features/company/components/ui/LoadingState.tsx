import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 animate-pulse">
      <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin mb-4"></div>
      <h3 className="text-lg font-medium text-slate-700 mt-2">
        Loading applicant details...
      </h3>
      <p className="text-slate-500 text-sm mt-1">
        Please wait while we fetch the information
      </p>
    </div>
  );
};

export default LoadingState;
