import React from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
  helpText?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  className = "",
  children,
  helpText,
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700 mb-1 transition-colors duration-200"
      >
        {label} {required && <span className="text-rose-500">*</span>}
      </label>

      {children}

      {error ? (
        <p className="text-rose-500 text-xs mt-1 animate-fadeIn">{error}</p>
      ) : helpText ? (
        <p className="text-gray-500 text-xs mt-1">{helpText}</p>
      ) : null}
    </div>
  );
};

export default FormField;
