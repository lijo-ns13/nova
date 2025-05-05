import React, { useState } from "react";

interface TextAreaFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  error?: boolean;
  className?: string;
  required?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  error = false,
  className = "",
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-3 py-2.5 rounded-lg bg-white border transition-all duration-200
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:ring-opacity-50"
              : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
          }
          ${isFocused ? "shadow-sm" : ""}
        `}
      />

      {/* Animated bottom border effect */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-300 rounded-full ${
          isFocused ? "w-[calc(100%-16px)]" : "w-0"
        }`}
      />
    </div>
  );
};

export default TextAreaField;
