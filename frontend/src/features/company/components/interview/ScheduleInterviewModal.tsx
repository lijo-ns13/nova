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
import { companyInterviewService } from "../../services/InterviewReschedueService";
import { handleApiError } from "../../../../utils/apiError";
import { toast } from "../ui/Toast";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  userId: string;
  jobId: string;
  onInterviewScheduled?: () => void;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  userId,
  jobId,
  onInterviewScheduled,
}) => {
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState(false);
  const [showTimeSuggestions, setShowTimeSuggestions] = useState(false);

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
      setFieldErrors({});
      setSuccess(false);
      setTouched(false);
    }
  }, [isOpen]);

  const minDate = getMinValidDate();
  const isValid = isDateValid(scheduledAt);

  const handleTimeSuggestion = (time: string) => {
    const dateStr =
      scheduledAt?.split("T")[0] || new Date().toISOString().split("T")[0];
    setScheduledAt(`${dateStr}T${time}`);
    setTouched(true);
    setError("");
    setFieldErrors({});
  };

  const handleSchedule = async () => {
    if (!scheduledAt) {
      setError("Please select a date and time.");
      return;
    }

    if (!isValid) {
      setError("Interview must be scheduled at least 1 days from today.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setFieldErrors({});

      await companyInterviewService.scheduleInterview({
        userId,
        applicationId,
        jobId,
        scheduledAt,
      });

      setSuccess(true);
      toast({
        title: "Interview Scheduled",
        description: `Interview scheduled for ${formatInterviewDate(
          scheduledAt
        )}.`,
        variant: "success",
      });

      setTimeout(() => {
        onInterviewScheduled?.();
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const parsed = handleApiError(err, "Failed to schedule interview");
      setError(parsed.message ?? "Something went wrong");
      setFieldErrors(parsed.errors ?? {});

      toast({
        title: "Error",
        description: parsed.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm">
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-0">
        <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl animate-scaleIn">
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>

          <div className="p-6 sm:p-8">
            {success ? (
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Interview Scheduled!
                </h3>
                <p className="text-slate-600 mb-6">
                  Interview successfully scheduled for{" "}
                  <span className="font-medium">
                    {formatInterviewDate(scheduledAt)}
                  </span>
                  .
                </p>
                <button
                  onClick={onClose}
                  className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-3">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">
                    Schedule Interview
                  </h3>
                  <p className="text-slate-500">Select a date and time</p>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <p className="ml-3 text-sm text-blue-700">
                        Schedule at least 5 days in advance to give candidates
                        time to prepare.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Interview Date
                    </label>
                    <input
                      type="date"
                      value={scheduledAt.split("T")[0] || ""}
                      onChange={(e) => {
                        const time = scheduledAt.split("T")[1] || "09:00";
                        setScheduledAt(`${e.target.value}T${time}`);
                        setTouched(true);
                        setError("");
                        setFieldErrors({});
                      }}
                      min={minDate.split("T")[0]}
                      className={`w-full rounded-lg border px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 ${
                        touched && !isValid && scheduledAt
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      }`}
                    />
                    {fieldErrors.scheduledAt && (
                      <p className="mt-1 text-sm text-red-600">
                        {fieldErrors.scheduledAt}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                          setError("");
                          setFieldErrors({});
                        }}
                        className={`w-full rounded-lg border px-4 py-2.5 transition-colors focus:outline-none focus:ring-2 ${
                          touched && !isValid && scheduledAt
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                            : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
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
                        {timeSuggestions.map((t) => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => handleTimeSuggestion(t.value)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {touched && !isValid && scheduledAt && (
                    <div className="bg-red-50 p-4 border border-red-100 rounded-lg">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <p className="ml-3 text-sm text-red-700">
                          Interview must be scheduled at least 5 days from
                          today.
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 p-4 border border-red-100 rounded-lg">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            Error
                          </h3>
                          <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSchedule}
                    disabled={loading || !scheduledAt || !isValid}
                    className={`w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors ${
                      loading || !scheduledAt || !isValid
                        ? "bg-blue-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? (
                      <span className="inline-flex items-center">
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
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;
