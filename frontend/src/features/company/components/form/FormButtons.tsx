import React from "react";
import { CheckCircle, X } from "lucide-react";

interface FormButtonsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  isSubmitting,
  onCancel = () => window.history.back(),
}) => {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 flex items-center justify-center gap-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
      >
        <X className="w-4 h-4" />
        <span>Cancel</span>
      </button>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-5 py-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-70 transition-all duration-200"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Create Job</span>
          </>
        )}
      </button>
    </div>
  );
};

export default FormButtons;
