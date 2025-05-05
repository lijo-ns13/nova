import React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy" | "none";
  className?: string;
  initials?: string;
  bordered?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User avatar",
  size = "md",
  status = "none",
  className = "",
  initials,
  bordered = false,
}) => {
  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-14 w-14 text-lg",
    xl: "h-20 w-20 text-xl",
  };

  const statusClasses = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    none: "hidden",
  };

  const borderClasses = bordered
    ? "ring-2 ring-white dark:ring-gray-800 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
    : "";

  const getInitials = () => {
    if (initials) return initials;
    if (alt && alt !== "User avatar") {
      return alt
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
    }
    return "U";
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`overflow-hidden rounded-full bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900 dark:to-indigo-950 flex items-center justify-center ${sizeClasses[size]} ${borderClasses}`}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
        ) : (
          <span className="font-medium text-indigo-700 dark:text-indigo-300">
            {getInitials()}
          </span>
        )}
      </div>
      {status !== "none" && (
        <span
          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${statusClasses[status]} ring-2 ring-white`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;
