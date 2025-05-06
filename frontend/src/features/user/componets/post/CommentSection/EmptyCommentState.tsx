import React from "react";
import { MessageSquare } from "lucide-react";

const EmptyCommentState: React.FC = () => {
  return (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 inline-flex flex-col items-center max-w-xs mx-auto transform transition-all hover:scale-105">
        <div className="mb-4 bg-white dark:bg-gray-800 p-3 rounded-full">
          <MessageSquare className="w-8 h-8 text-indigo-500" />
        </div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
          No comments yet
        </p>
        <p className="text-sm">Be the first to share your thoughts!</p>
      </div>
    </div>
  );
};

export default EmptyCommentState;
