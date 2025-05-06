import React from "react";

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-16 h-16">
          <div className="animate-ping absolute w-16 h-16 rounded-full bg-blue-400 opacity-75"></div>
          <div className="relative w-16 h-16 rounded-full bg-blue-500 opacity-90"></div>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Loading users...
      </p>
    </div>
  );
};

export default LoadingIndicator;
