import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "success" | "error" | "warning" | "info";
}

interface ToastState extends ToastProps {
  id: string;
  visible: boolean;
}

let toasts: ToastState[] = [];
let listeners: ((toasts: ToastState[]) => void)[] = [];

const addToast = (toast: ToastState) => {
  toasts = [...toasts, toast];
  listeners.forEach((listener) => listener(toasts));
};

const removeToast = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id);
  listeners.forEach((listener) => listener(toasts));
};

export const toast = ({ title, description, variant = "info" }: ToastProps) => {
  const id = Math.random().toString(36).substr(2, 9);

  addToast({
    id,
    title,
    description,
    variant,
    visible: true,
  });

  setTimeout(() => {
    removeToast(id);
  }, 5000);
};

const ToastIcon = ({ variant }: { variant: ToastProps["variant"] }) => {
  switch (variant) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "error":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    default:
      return <Info className="w-5 h-5 text-blue-500" />;
  }
};

const getToastStyles = (variant: ToastProps["variant"]) => {
  switch (variant) {
    case "success":
      return "bg-green-50 border-green-200 text-green-800";
    case "error":
      return "bg-red-50 border-red-200 text-red-800";
    case "warning":
      return "bg-amber-50 border-amber-200 text-amber-800";
    default:
      return "bg-blue-50 border-blue-200 text-blue-800";
  }
};

export const Toaster = () => {
  const [currentToasts, setCurrentToasts] = useState<ToastState[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastState[]) => {
      setCurrentToasts(newToasts);
    };

    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 w-full max-w-md pointer-events-none">
      {currentToasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start w-full rounded-lg border p-4 shadow-lg animate-slideInRight ${getToastStyles(
            toast.variant
          )}`}
          role="alert"
        >
          <div className="flex-shrink-0">
            <ToastIcon variant={toast.variant} />
          </div>

          <div className="ml-3 w-0 flex-1">
            {toast.title && (
              <p className="text-sm font-medium">{toast.title}</p>
            )}
            {toast.description && (
              <p className="mt-1 text-sm opacity-90">{toast.description}</p>
            )}
          </div>

          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={() => removeToast(toast.id)}
              className="inline-flex rounded-md hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
