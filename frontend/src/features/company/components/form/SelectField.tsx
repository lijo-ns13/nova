import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: boolean;
  className?: string;
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error = false,
  className = "",
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            appearance-none w-full px-3 py-2.5 rounded-lg bg-white border transition-all duration-200 pr-10
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 focus:ring-opacity-50"
                : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
            }
            ${isFocused ? "shadow-sm" : ""}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Animated bottom border effect */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-300 rounded-full ${
          isFocused ? "w-[calc(100%-16px)]" : "w-0"
        }`}
      />
    </div>
  );
};

export default SelectField;
