import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface ConfirmSoftDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  itemType?: string;
  itemName?: string;
  extraMessage?: string;
}

const ConfirmSoftDeleteModal = ({
  isOpen,
  onConfirm,
  onCancel,
  itemType = "item",
  itemName,
  extraMessage,
}: ConfirmSoftDeleteModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden dark:bg-gray-800 relative border dark:border-gray-700"
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>

            <div className="p-6 space-y-6">
              {/* Header Section */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg">
                  <TrashIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {itemType}?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1"></p>
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-4">
                {itemName && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-center font-medium text-red-700 dark:text-red-300">
                      You're ...:{" "}
                      <span className="font-semibold">{itemName}</span>
                    </p>
                  </div>
                )}

                {extraMessage && (
                  <div className="text-sm text-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-700 dark:text-blue-300">
                    {extraMessage}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
                >
                  <XMarkIcon className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-br from-red-500 to-orange-500 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <TrashIcon className="w-5 h-5 text-white" />
                  Confirm
                </button>
              </div>
            </div>

            {/* Animated Border Decoration */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmSoftDeleteModal;
