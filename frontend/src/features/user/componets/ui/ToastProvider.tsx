import React, { useState, useCallback, createContext, useContext } from "react";
import Toast, { ToastType } from "./Toast";

// Unique ID generator for toasts
const generateId = () =>
  `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (type: ToastType, message: string, duration?: number) => {
      const id = generateId();
      setToasts((prev) => [...prev, { id, type, message, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Provide toast context
  const contextValue = { showToast };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        className="toast-container"
        style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 9999 }}
      >
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              marginBottom: "0.5rem",
              position: "relative",
              top: `${index * 4}rem`,
            }}
          >
            <Toast
              id={toast.id}
              type={toast.type}
              message={toast.message}
              duration={toast.duration}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
