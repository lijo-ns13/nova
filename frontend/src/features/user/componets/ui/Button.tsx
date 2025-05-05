import React from "react";

type ButtonVariant = "primary" | "secondary" | "outlined" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg focus:ring-indigo-500/50",
    secondary:
      "bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white shadow-md hover:shadow-lg focus:ring-teal-500/50",
    outlined:
      "border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-500 focus:ring-indigo-500/30",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-700 hover:text-indigo-500 focus:ring-gray-500/30",
    danger:
      "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md hover:shadow-lg focus:ring-red-500/50",
  };

  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-6 py-3 rounded-xl",
  };

  const fullWidthClass = fullWidth ? "w-full" : "";

  const loadingClass = isLoading ? "opacity-80 cursor-wait" : "";

  const disabledClass = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidthClass} ${loadingClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="animate-spin h-4 w-4 mr-2">
          <svg
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
      {!isLoading && icon}
      {children}
    </button>
  );
};

export default Button;
