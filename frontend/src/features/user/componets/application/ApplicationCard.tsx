import { FC, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
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

const getStatusClasses = (status: ApplicationStatus): string => {
  if (
    [
      "rejected",
      "interview_rejected_by_user",
      "interview_reschedule_rejected",
    ].includes(status)
  )
    return "bg-red-100 text-red-800 border-red-200";
  if (
    [
      "selected",
      "hired",
      "interview_accepted_by_user",
      "interview_reschedule_accepted",
      "interview_passed",
      "offered",
    ].includes(status)
  )
    return "bg-green-100 text-green-800 border-green-200";
  return "bg-blue-100 text-blue-800 border-blue-200";
};

const formatStatusMessage = (status: string): string => {
  const statusMap: Record<string, string> = {
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

  return statusMap[status] || status.replace(/_/g, " ");
};

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })} at ${date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const ApplicationCard: FC<ApplicationCardProps> = ({
  appliedJob,
  onStatusChange,
}) => {
  const { _id, job, appliedAt, status, scheduledAt } = appliedJob;

  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [rescheduleSlots, setRescheduleSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

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
    <article className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          {/* Job Info */}
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
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
              </div>
            </div>

            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Applied:</span>{" "}
                {formatDistanceToNow(new Date(appliedAt), { addSuffix: true })}
              </p>

              {showScheduledTime && scheduledAt && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Interview:</span>{" "}
                  {formatDateTime(scheduledAt)}
                </p>
              )}
            </div>
          </div>

          {/* Status + Actions */}
          <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
            <div className="flex flex-col items-end gap-2 w-full">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusClasses(
                  status as ApplicationStatus
                )}`}
              >
                {formatStatusMessage(status)}
              </span>

              {canRespondToInterview && !isRescheduleProposed && (
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => respondToInterview("accept")}
                    disabled={loading}
                    className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondToInterview("reject")}
                    disabled={loading}
                    className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reschedule Slot Selection */}
        {isRescheduleProposed && rescheduleSlots.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">
                New Interview Time Proposal
              </h3>
              <p className="text-sm text-gray-600">
                Please select one of the proposed time slots or reject the
                request:
              </p>

              <div className="space-y-2">
                <label
                  htmlFor="reschedule-slot"
                  className="block text-sm font-medium text-gray-700"
                >
                  Available Time Slots
                </label>
                <select
                  id="reschedule-slot"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedSlot ?? ""}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  disabled={slotsLoading}
                >
                  <option value="">Select a time slot</option>
                  {rescheduleSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {formatDateTime(slot)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleRescheduleAccept}
                  disabled={loading || !selectedSlot}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Accept New Time
                </button>
                <button
                  onClick={handleRescheduleReject}
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Reject Reschedule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default ApplicationCard;
