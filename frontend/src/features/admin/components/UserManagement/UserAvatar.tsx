import React from "react";
import { SecureCloudinaryImage } from "../../../../components/SecureCloudinaryImage";

interface UserAvatarProps {
  name: string;
  imageSrc?: string;
  size?: "sm" | "md" | "lg";
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  imageSrc,
  size = "md",
}) => {
  // Get initials from name
  const getInitials = (name: string): string => {
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  // Generate a deterministic color based on the name
  const getAvatarColor = (name: string): string => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  if (imageSrc) {
    return (
      // <img
      //   src={imageSrc}
      //   alt={name}
      //   className={`${sizeClasses[size]} rounded-full object-cover`}
      // />
      <SecureCloudinaryImage
        publicId={imageSrc}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${getAvatarColor(
        name
      )} rounded-full flex items-center justify-center text-white font-medium`}
    >
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar;
