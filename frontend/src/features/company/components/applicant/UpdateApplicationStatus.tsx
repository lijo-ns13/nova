import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { updateApplicationStatus } from "../../services/newApplicantService";

export enum ApplicationStatus {
  APPLIED = "applied",
  SHORTLISTED = "shortlisted",
  INTERVIEW_SCHEDULED = "interview_scheduled",
  INTERVIEW_RESCHEDULED = "interview_rescheduled",
  INTERVIEW_ACCEPTED_BY_USER = "interview_accepted_by_user",
  INTERVIEW_REJECTED_BY_USER = "interview_rejected_by_user",
  INTERVIEW_CANCELLED = "interview_cancelled",
  INTERVIEW_COMPLETED = "interview_completed",
  INTERVIEW_PASSED = "interview_passed",
  INTERVIEW_FAILED = "interview_failed",
  OFFERED = "offered",
  HIRED = "hired",
  SELECTED = "selected",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

interface Props {
  applicationId: string;
  currentStatus: ApplicationStatus;
  onSuccess?: () => void;
}

const statusesRequiringReason: ApplicationStatus[] = [
  ApplicationStatus.REJECTED,
  ApplicationStatus.INTERVIEW_RESCHEDULED,
  ApplicationStatus.INTERVIEW_CANCELLED,
  ApplicationStatus.INTERVIEW_REJECTED_BY_USER,
  ApplicationStatus.WITHDRAWN,
];

// Only allow backend-updatable transitions
const disallowedStatuses: ApplicationStatus[] = [
  ApplicationStatus.INTERVIEW_SCHEDULED,
  ApplicationStatus.INTERVIEW_RESCHEDULED,
  ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER,
  ApplicationStatus.INTERVIEW_REJECTED_BY_USER,
];

const allowedTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  [ApplicationStatus.APPLIED]: [
    ApplicationStatus.SHORTLISTED,
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
  ],
  [ApplicationStatus.SHORTLISTED]: [
    // ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
  ],
  [ApplicationStatus.INTERVIEW_SCHEDULED]: [
    ApplicationStatus.INTERVIEW_CANCELLED,
  ],
  [ApplicationStatus.INTERVIEW_RESCHEDULED]: [],
  [ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER]: [
    ApplicationStatus.INTERVIEW_COMPLETED,
  ],
  [ApplicationStatus.INTERVIEW_COMPLETED]: [
    ApplicationStatus.INTERVIEW_PASSED,
    ApplicationStatus.INTERVIEW_FAILED,
  ],
  [ApplicationStatus.INTERVIEW_PASSED]: [ApplicationStatus.OFFERED],
  [ApplicationStatus.OFFERED]: [
    ApplicationStatus.WITHDRAWN,
    ApplicationStatus.HIRED,
  ],
  [ApplicationStatus.REJECTED]: [],
  [ApplicationStatus.WITHDRAWN]: [],
  [ApplicationStatus.HIRED]: [],
  [ApplicationStatus.INTERVIEW_REJECTED_BY_USER]: [],
  [ApplicationStatus.INTERVIEW_CANCELLED]: [],
  [ApplicationStatus.INTERVIEW_FAILED]: [],
  [ApplicationStatus.SELECTED]: [],
};

export const UpdateApplicationStatus: React.FC<Props> = ({
  applicationId,
  currentStatus,
  onSuccess,
}) => {
  const [newStatus, setNewStatus] = useState<ApplicationStatus | "">("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const nextStatuses = useMemo(() => {
    return (allowedTransitions[currentStatus] || []).filter(
      (status) => !disallowedStatuses.includes(status)
    );
  }, [currentStatus]);

  const handleSubmit = async () => {
    if (!newStatus) return toast.error("Please select a status");

    if (statusesRequiringReason.includes(newStatus) && !reason.trim()) {
      return toast.error("Reason is required for this status");
    }

    try {
      setLoading(true);
      await updateApplicationStatus(applicationId, {
        status: newStatus,
        reason: reason.trim() || undefined,
      });
      toast.success("Status updated successfully");
      setNewStatus("");
      setReason("");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (nextStatuses.length === 0) {
    return (
      <div className="p-4 text-gray-600">
        No further status updates available for this application.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-md border max-w-md w-full">
      <h2 className="text-lg font-semibold mb-3">Update Application Status</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Next Status</label>
        <select
          className="w-full border rounded p-2"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
        >
          <option value="">Select status</option>
          {nextStatuses.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {statusesRequiringReason.includes(newStatus as ApplicationStatus) && (
        <div className="mb-4">
          <label className="block font-medium mb-1">Reason (Required)</label>
          <textarea
            className="w-full border rounded p-2"
            rows={3}
            placeholder="Enter reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Updating..." : "Update Status"}
      </button>
    </div>
  );
};
