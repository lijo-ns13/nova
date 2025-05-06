import React from "react";

const LoadingComments: React.FC = () => {
  return (
    <div className="space-y-5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse flex gap-3">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-8 w-8 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-20 md:h-16 bg-gray-200 dark:bg-gray-700 rounded-xl mb-2"></div>
            <div className="flex gap-3 mt-2">
              <div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            {i === 0 && (
              <div className="mt-4 ml-6 space-y-4">
                <div className="animate-pulse flex gap-3">
                  <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-6 w-6 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-2.5 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-2"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingComments;
