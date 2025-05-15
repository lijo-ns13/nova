import React from "react";

interface FormButtonsProps {
  isSubmitting: boolean;
  onCancel?: () => void;
  submitText?: string;
  loadingText?: string;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  isSubmitting,
  onCancel,
  submitText = "Create Job",
  loadingText = "Creating...",
}) => {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
      {onCancel && (
        <button
          type="button"
          className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center transition-colors"
      >
        {isSubmitting && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {isSubmitting ? loadingText : submitText}
      </button>
    </div>
  );
};

export default FormButtons;
