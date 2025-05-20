import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const bgColor = {
    success: "bg-green-100 border-green-500 text-green-800",
    error: "bg-red-100 border-red-500 text-red-800",
    info: "bg-blue-100 border-blue-500 text-blue-800",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
  }[type];

  const iconColor = {
    success: "text-green-500",
    error: "text-red-500",
    info: "text-blue-500",
    warning: "text-yellow-500",
  }[type];

  return (
    <div
      className={`fixed right-4 transform transition-all duration-300 ease-in-out border-l-4 rounded shadow-lg px-4 py-3 flex items-center max-w-md ${bgColor} ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
      style={{ top: "1rem", zIndex: 9999 }}
    >
      <div className="flex-grow mr-2">{message}</div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        className={`${iconColor} hover:opacity-75 transition-opacity focus:outline-none`}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
