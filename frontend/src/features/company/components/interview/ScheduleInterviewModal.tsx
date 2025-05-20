import React, { useState, useEffect } from "react";
import { isDateValid, getMinValidDate } from "../../util/dateUtils";

import LoadingSpinner from "./LoadingSpinner";
import companyAxios from "../../../../utils/companyAxios";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  userId: string;
  onInterviewScheduled?: () => void;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  userId,
  onInterviewScheduled,
}) => {
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState(false);

  // Reset the form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setScheduledAt("");
      setError("");
      setSuccess(false);
      setTouched(false);
    }
  }, [isOpen]);

  const minDate = getMinValidDate();
  const isValid = isDateValid(scheduledAt);

  const handleSchedule = async () => {
    if (!scheduledAt) {
      setError("Please select a date and time.");
      return;
    }

    if (!isValid) {
      setError("Interview must be scheduled at least 5 days from today.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await companyAxios.post("/interview", {
        userId,
        applicationId,
        scheduledAt,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onInterviewScheduled?.();
          onClose();
        }, 1500);
      } else {
        setError(response.data.message || "Failed to schedule interview.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Schedule Interview
                </h3>

                <div className="mt-4 space-y-4">
                  {success ? (
                    <div className="bg-green-50 p-4 rounded-md border border-green-100 text-green-700 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Interview scheduled successfully!
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Interview Date & Time{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-gray-500 mb-1">
                          Note: Interviews must be scheduled at least 5 days
                          from today.
                        </p>
                        <input
                          type="datetime-local"
                          value={scheduledAt}
                          onChange={(e) => {
                            setScheduledAt(e.target.value);
                            setTouched(true);
                          }}
                          min={minDate}
                          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            touched && !isValid && scheduledAt
                              ? "border-red-300 text-red-900 placeholder-red-300"
                              : "border-gray-300"
                          }`}
                        />

                        {touched && !isValid && scheduledAt && (
                          <p className="mt-1 text-sm text-red-600">
                            Interview must be scheduled at least 5 days from
                            today.
                          </p>
                        )}

                        {error && (
                          <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
                            {error}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {!success && (
              <>
                <button
                  type="button"
                  onClick={handleSchedule}
                  disabled={loading || !scheduledAt}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    !scheduledAt
                      ? "bg-blue-300 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  } sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {loading ? (
                    <LoadingSpinner size="small" className="mr-2" />
                  ) : null}
                  {loading ? "Scheduling..." : "Schedule Interview"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
