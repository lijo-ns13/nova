import { FC, useEffect, useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import toast from "react-hot-toast";
import {
  acceptReschedule,
  getRescheduleSlots,
  updateInterviewStatus,
} from "../../services/InterviewRescheduleService";
import { AppliedJobResponseDTO } from "../../services/JobServices";
import { ApplicationStatus } from "../../../../constants/applicationStatus";

interface ApplicationCardProps {
  appliedJob: AppliedJobResponseDTO;
  onStatusChange?: () => void;
}

const statusClassesMap: Record<string, string> = {
  rejected: "bg-red-100 text-red-800 border-red-200",
  interview_rejected_by_user: "bg-red-100 text-red-800 border-red-200",
  interview_reschedule_rejected: "bg-red-100 text-red-800 border-red-200",
  selected: "bg-green-100 text-green-800 border-green-200",
  hired: "bg-green-100 text-green-800 border-green-200",
  interview_accepted_by_user: "bg-green-100 text-green-800 border-green-200",
  interview_reschedule_accepted: "bg-green-100 text-green-800 border-green-200",
  interview_passed: "bg-green-100 text-green-800 border-green-200",
  offered: "bg-green-100 text-green-800 border-green-200",
  default: "bg-blue-100 text-blue-800 border-blue-200",
};

const statusLabelMap: Record<string, string> = {
  rejected: "Rejected",
  interview_rejected_by_user: "Interview Rejected",
  interview_reschedule_rejected: "Reschedule Rejected",
  selected: "Selected",
  hired: "Hired",
  interview_accepted_by_user: "Interview Accepted",
  interview_reschedule_accepted: "Reschedule Accepted",
  interview_passed: "Interview Passed",
  offered: "Offered",
  interview_scheduled: "Interview Scheduled",
  interview_reschedule_proposed: "Reschedule Proposed",
  applied: "Applied",
  under_review: "Under Review",
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return `${format(date, "dd MMM yyyy")} at ${format(date, "hh:mm a")}`;
};

const ApplicationCard: FC<ApplicationCardProps> = ({
  appliedJob,
  onStatusChange,
}) => {
  const {
    _id,
    job,
    appliedAt,
    status,
    scheduledAt,
    statusHistory,
    resumeMediaId,
  } = appliedJob;

  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [rescheduleSlots, setRescheduleSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const isRescheduleProposed = status === "interview_reschedule_proposed";
  const canRespondToInterview = [
    "interview_scheduled",
    "interview_reschedule_proposed",
  ].includes(status);
  const showScheduledTime = [
    "interview_scheduled",
    "interview_accepted_by_user",
    "interview_reschedule_proposed",
    "interview_reschedule_accepted",
  ].includes(status);

  useEffect(() => {
    if (isRescheduleProposed) {
      setSlotsLoading(true);
      getRescheduleSlots(_id)
        .then((res) => setRescheduleSlots(res.data))
        .catch((err) => toast.error(err.message))
        .finally(() => setSlotsLoading(false));
    }
  }, [isRescheduleProposed, _id]);

  const respondToInterview = async (action: "accept" | "reject") => {
    try {
      setLoading(true);
      const newStatus: ApplicationStatus =
        status === "interview_scheduled"
          ? action === "accept"
            ? "interview_accepted_by_user"
            : "interview_rejected_by_user"
          : action === "accept"
          ? "interview_reschedule_accepted"
          : "interview_reschedule_rejected";

      await updateInterviewStatus(_id, newStatus);
      toast.success(`Interview ${action}ed`);
      onStatusChange?.();
    } catch {
      toast.error(`Failed to ${action} interview`);
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleAccept = async () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    try {
      setLoading(true);
      await acceptReschedule(
        _id,
        "interview_reschedule_accepted",
        selectedSlot
      );
      toast.success("Interview reschedule accepted");
      onStatusChange?.();
    } catch {
      toast.error("Failed to accept interview reschedule");
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleReject = async () => {
    try {
      setLoading(true);
      await acceptReschedule(_id, "interview_reschedule_rejected");
      toast.success("Interview reschedule rejected");
      onStatusChange?.();
    } catch {
      toast.error("Failed to reject interview reschedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md w-full md:w-[700px] mx-auto">
      <div className="p-6 space-y-6">
        {/* Job Info */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 truncate">
              {job.title}
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {job.jobType}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                {job.location}
              </span>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Applied:</span>{" "}
                {formatDistanceToNow(new Date(appliedAt), { addSuffix: true })}
              </p>
              {showScheduledTime && scheduledAt && (
                <p>
                  <span className="font-medium">Interview:</span>{" "}
                  {formatDateTime(scheduledAt)}
                </p>
              )}
            </div>
          </div>

          {/* Status & Actions */}
          <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                statusClassesMap[status] || statusClassesMap.default
              }`}
            >
              {statusLabelMap[status] || status.replace(/_/g, " ")}
            </span>

            {canRespondToInterview && !isRescheduleProposed && (
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                <button
                  onClick={() => respondToInterview("accept")}
                  disabled={loading}
                  className="group relative flex-1 px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200 border border-green-500 hover:border-green-400 shadow-md hover:shadow-lg"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {loading ? "Processing..." : "Accept Interview"}
                  </span>
                </button>

                <button
                  onClick={() => respondToInterview("reject")}
                  disabled={loading}
                  className="group relative flex-1 px-6 py-3 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200 border border-red-500 hover:border-red-400 shadow-md hover:shadow-lg"
                >
                  <span className="relative flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {loading ? "Processing..." : "Reject Interview"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reschedule Slots */}
        {isRescheduleProposed && rescheduleSlots.length > 0 && (
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  New Interview Time Proposal
                </h3>
              </div>
              <p className="text-sm text-gray-600 max-w-md mx-auto sm:mx-0">
                Please select one of the proposed time slots or reject the
                request
              </p>
            </div>

            {/* Time Slot Selection */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative">
                <select
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  value={selectedSlot ?? ""}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  disabled={slotsLoading}
                >
                  <option value="" className="text-gray-500">
                    {slotsLoading
                      ? "Loading time slots..."
                      : "Select a time slot"}
                  </option>
                  {rescheduleSlots.map((slot) => (
                    <option key={slot} value={slot} className="py-2">
                      {formatDateTime(slot)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleRescheduleAccept}
                disabled={loading || !selectedSlot}
                className="group relative flex-1 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-md overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Accept New Time
                </span>
              </button>

              <button
                onClick={handleRescheduleReject}
                disabled={loading}
                className="group relative flex-1 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-md overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Reject Reschedule
                </span>
              </button>
            </div>

            {/* Selected Slot Preview */}
            {selectedSlot && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg animate-pulse">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>
                    Selected: <strong>{formatDateTime(selectedSlot)}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status History */}
        {statusHistory && statusHistory.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowHistory(!showHistory)}
              aria-expanded={showHistory}
              className="flex items-center justify-between w-full text-sm text-blue-600 hover:underline focus:outline-none"
            >
              <span>
                {showHistory ? "Hide Status History" : "View Status History"}
              </span>
              <svg
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${
                  showHistory ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showHistory && (
              <div className="mt-2 max-h-64 overflow-y-auto rounded-md border border-gray-100 bg-gray-50 p-3">
                <ul className="space-y-2">
                  {statusHistory.map((entry, index) => (
                    <li
                      key={index}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 flex flex-col sm:flex-row sm:gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${
                            statusClassesMap[entry.status] ||
                            statusClassesMap.default
                          }`}
                        >
                          {statusLabelMap[entry.status] ||
                            entry.status.replace(/_/g, " ")}
                        </span>
                        {entry.reason && (
                          <span className="text-gray-500 text-xs sm:ml-2">
                            (Reason: {entry.reason})
                          </span>
                        )}
                      </div>
                      <span className="text-gray-400 text-xs whitespace-nowrap">
                        {formatDateTime(entry.changedAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default ApplicationCard;
