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
    return "bg-red-100 text-red-700";
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
    return "bg-green-100 text-green-700";
  return "bg-blue-100 text-blue-700";
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
  })} at ${date.toLocaleTimeString("en-US")}`;
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
    <article className="bg-white border rounded-xl shadow-sm p-5 transition hover:shadow-md">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Job Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{job.title}</h2>
          <p className="text-sm text-gray-500 capitalize">{job.location}</p>
          <p className="text-sm text-gray-500">{job.jobType}</p>
        </div>

        {/* Application Info */}
        <div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Applied: </span>
            {formatDistanceToNow(new Date(appliedAt), { addSuffix: true })}
          </p>

          {showScheduledTime && scheduledAt && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Interview: </span>
              {formatDateTime(scheduledAt)}
            </p>
          )}

          {/* Reschedule Slot Selection */}
          {isRescheduleProposed && rescheduleSlots.length > 0 && (
            <div className="mt-2">
              <label className="text-sm font-medium text-gray-700">
                Choose Reschedule Slot
              </label>
              <select
                className="mt-1 block w-full border rounded px-3 py-2 text-sm"
                value={selectedSlot ?? ""}
                onChange={(e) => setSelectedSlot(e.target.value)}
                disabled={slotsLoading}
                aria-label="Select a reschedule slot"
              >
                <option value="" disabled>
                  Select a slot
                </option>
                {rescheduleSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {formatDateTime(slot)}
                  </option>
                ))}
              </select>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleRescheduleAccept}
                  disabled={loading || !selectedSlot}
                  className="px-4 py-1 text-sm font-medium text-green-700 border border-green-500 rounded hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Accept Slot
                </button>
                <button
                  onClick={handleRescheduleReject}
                  disabled={loading}
                  className="px-4 py-1 text-sm font-medium text-red-700 border border-red-500 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Slot
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status + Actions */}
        <div className="flex flex-col md:items-end gap-2">
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusClasses(
              status as ApplicationStatus
            )}`}
            aria-label="Application status"
          >
            {formatStatusMessage(status)}
          </span>

          {canRespondToInterview && !isRescheduleProposed && (
            <div className="flex gap-2">
              <button
                onClick={() => respondToInterview("accept")}
                disabled={loading}
                className="px-4 py-1 text-sm font-medium text-green-700 border border-green-500 rounded hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Accept interview"
              >
                Accept
              </button>
              <button
                onClick={() => respondToInterview("reject")}
                disabled={loading}
                className="px-4 py-1 text-sm font-medium text-red-700 border border-red-500 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Reject interview"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ApplicationCard;
