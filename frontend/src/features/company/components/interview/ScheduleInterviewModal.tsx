import React, { useState, useEffect } from "react";
import {
  Calendar,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  getMinValidDate,
  isDateValid,
  formatInterviewDate,
} from "../../util/dateUtilApplicant";
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
  const [showTimeSuggestions, setShowTimeSuggestions] = useState(false);

  // Suggested time slots (can be customized)
  const timeSuggestions = [
    { label: "Morning (9:00 AM)", value: "09:00" },
    { label: "Midday (12:00 PM)", value: "12:00" },
    { label: "Afternoon (3:00 PM)", value: "15:00" },
    { label: "Evening (5:00 PM)", value: "17:00" },
  ];

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

  const handleTimeSuggestion = (time: string) => {
    if (!scheduledAt) {
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0];
      setScheduledAt(`${dateStr}T${time}`);
    } else {
      const dateStr = scheduledAt.split("T")[0];
      setScheduledAt(`${dateStr}T${time}`);
    }
    setTouched(true);
  };

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm transition-opacity animate-fadeIn">
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-0">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all animate-scaleIn">
          {/* Close Button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-6 sm:p-8">
            {success ? (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Interview Scheduled!
                </h3>
                <p className="text-slate-600 mb-6">
                  The interview has been successfully scheduled for{" "}
                  <span className="font-medium">
                    {formatInterviewDate(scheduledAt)}
                  </span>
                  .
                </p>
                <button
                  onClick={onClose}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-3">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">
                    Schedule Interview
                  </h3>
                  <p className="text-slate-500">
                    Select a date and time for the interview
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="rounded-lg bg-blue-50 p-4 mb-4">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Please schedule the interview at least 5 days in
                          advance to give the candidate time to prepare.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Interview Date
                    </label>
                    <input
                      type="date"
                      value={scheduledAt.split("T")[0] || ""}
                      onChange={(e) => {
                        const time = scheduledAt.split("T")[1] || "09:00";
                        setScheduledAt(`${e.target.value}T${time}`);
                        setTouched(true);
                      }}
                      min={minDate.split("T")[0]}
                      className={`w-full rounded-lg border ${
                        touched && !isValid && scheduledAt
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      } px-4 py-2.5 focus:outline-none focus:ring-2 transition-colors`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Interview Time
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        value={scheduledAt.split("T")[1] || ""}
                        onChange={(e) => {
                          const date =
                            scheduledAt.split("T")[0] || minDate.split("T")[0];
                          setScheduledAt(`${date}T${e.target.value}`);
                          setTouched(true);
                        }}
                        className={`w-full rounded-lg border ${
                          touched && !isValid && scheduledAt
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        } px-4 py-2.5 focus:outline-none focus:ring-2 transition-colors`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowTimeSuggestions(!showTimeSuggestions)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showTimeSuggestions ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>

                    {showTimeSuggestions && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {timeSuggestions.map((time) => (
                          <button
                            key={time.value}
                            type="button"
                            onClick={() => handleTimeSuggestion(time.value)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
                          >
                            {time.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {touched && !isValid && scheduledAt && (
                    <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="ml-3">
                          <p className="text-sm text-red-700">
                            Interview must be scheduled at least 5 days from
                            today.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-lg bg-red-50 p-4 border border-red-100">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Error
                          </h3>
                          <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={handleSchedule}
                      disabled={loading || !scheduledAt || !isValid}
                      className={`w-full rounded-lg px-4 py-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                        loading || !scheduledAt || !isValid
                          ? "bg-blue-300 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                      }`}
                    >
                      {loading ? (
                        <span className="inline-flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Scheduling...
                        </span>
                      ) : (
                        `Schedule for ${
                          scheduledAt ? formatInterviewDate(scheduledAt) : "..."
                        }`
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
