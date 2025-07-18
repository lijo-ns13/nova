// components/ConfirmDeleteModal.tsx
import React from "react";
import { Dialog } from "@headlessui/react";
import Button from "./ui/Button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" aria-hidden="true" />
      <div className="bg-white rounded-xl shadow-lg z-50 p-6 max-w-sm w-full">
        <Dialog.Title className="text-lg font-semibold">Delete Post</Dialog.Title>
        <Dialog.Description className="mt-2 text-sm text-gray-600">
          Are you sure you want to delete this post? This action cannot be undone.
        </Dialog.Description>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="outline" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
