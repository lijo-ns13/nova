import React from "react";

import Button from "./Button";
import { AlertTriangle } from "lucide-react";
import BaseModal from "../../features/user/componets/modals/BaseModal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: "primary" | "danger" | "success";
  isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  confirmButtonVariant = "primary",
  isLoading = false,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelButtonText}
          </Button>
          <Button
            variant={confirmButtonVariant}
            onClick={handleConfirm}
            isLoading={isLoading}
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmationModal;
