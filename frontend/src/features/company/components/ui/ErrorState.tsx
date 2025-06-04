import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="min-h-[300px] flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertTriangle size={32} className="text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 text-center">
        {message}
      </h3>
      <p className="text-slate-500 text-sm mt-1 text-center">
        There was a problem loading the applicant information
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
