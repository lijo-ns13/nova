import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";

interface ConfirmSoftDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => Promise<void>;
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, loading]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

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
              disabled={loading}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-4">
                {itemName && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-center font-medium text-red-700 dark:text-red-300">
                      You're deleting:{" "}
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
                  disabled={loading}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XMarkIcon className="w-5 h-5" />
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-br from-red-500 to-orange-500 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8h4l-3 3 3 3h-4z"
                        ></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    <>
                      <TrashIcon className="w-5 h-5 text-white" />
                      Confirm
                    </>
                  )}
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
