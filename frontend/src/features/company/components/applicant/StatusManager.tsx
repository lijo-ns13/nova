import React, { useState, useMemo } from "react";
import { Calendar, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { ApplicationStatus } from "../../types/applicant";
import { getStatusColor, getStatusIcon } from "../../util/statusUtilsApplicant";
import { updateApplicationStatus } from "../../services/newApplicantService";

interface StatusManagerProps {
  applicant: any;
  applicationId: string;
  onStatusUpdate: () => void;
  onScheduleInterview: () => void;
}

const StatusManager: React.FC<StatusManagerProps> = ({
  applicant,
  applicationId,
  onStatusUpdate,
  onScheduleInterview,
}) => {
  const [newStatus, setNewStatus] = useState<ApplicationStatus | "">("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Statuses that require a reason when selected
  const statusesRequiringReason: ApplicationStatus[] = [
    ApplicationStatus.REJECTED,
    ApplicationStatus.INTERVIEW_RESCHEDULED,
    ApplicationStatus.INTERVIEW_CANCELLED,
    ApplicationStatus.INTERVIEW_REJECTED_BY_USER,
    ApplicationStatus.WITHDRAWN,
  ];

  // Statuses that cannot be set directly through the UI
  const disallowedStatuses: ApplicationStatus[] = [
    ApplicationStatus.INTERVIEW_SCHEDULED,
    ApplicationStatus.INTERVIEW_RESCHEDULED,
    ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER,
    ApplicationStatus.INTERVIEW_REJECTED_BY_USER,
  ];

  // Define allowed transitions for each status
  const allowedTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
    [ApplicationStatus.APPLIED]: [
      ApplicationStatus.SHORTLISTED,
      ApplicationStatus.REJECTED,
      ApplicationStatus.WITHDRAWN,
    ],
    [ApplicationStatus.SHORTLISTED]: [
      ApplicationStatus.REJECTED,
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

  // Calculate available next statuses
  const nextStatuses = useMemo(() => {
    return (
      allowedTransitions[applicant.status as ApplicationStatus] || []
    ).filter((status) => !disallowedStatuses.includes(status));
  }, [applicant.status]);

  const handleSubmit = async () => {
    if (!newStatus) {
      return;
    }

    if (
      statusesRequiringReason.includes(newStatus as ApplicationStatus) &&
      !reason.trim()
    ) {
      return;
    }

    try {
      setLoading(true);
      await updateApplicationStatus(applicationId, {
        status: newStatus,
        reason: reason.trim() || undefined,
      });

      setNewStatus("");
      setReason("");
      onStatusUpdate();
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentStatusColor = getStatusColor(applicant.status);
  const StatusIcon = getStatusIcon(applicant.status);

  // Special cases based on current status
  const showScheduleButton = applicant.status === ApplicationStatus.SHORTLISTED;
  const showScheduledInfo =
    applicant.status === ApplicationStatus.INTERVIEW_SCHEDULED ||
    applicant.status === ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Current Status Display */}
      <div className="flex items-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${currentStatusColor.bgLight} mr-4`}
        >
          <StatusIcon size={24} className={currentStatusColor.text} />
        </div>
        <div>
          <div className="text-sm text-slate-500">Current Status</div>
          <div className="text-lg font-semibold capitalize text-slate-900">
            {applicant.status.replace(/_/g, " ")}
          </div>
        </div>
      </div>

      {/* Interview Scheduled Info */}
      {showScheduledInfo && applicant.scheduledAt && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
          <Calendar
            size={20}
            className="text-blue-600 mt-0.5 mr-3 flex-shrink-0"
          />
          <div>
            <div className="font-medium text-blue-800">Interview Scheduled</div>
            <div className="text-blue-700 mt-1">
              {new Date(applicant.scheduledAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Status Update Form */}
      {nextStatuses.length > 0 ? (
        <div className="mt-6 border border-slate-200 rounded-lg p-4 bg-slate-50">
          <h3 className="font-medium text-slate-800 mb-3">Update Status</h3>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                New Status
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) =>
                  setNewStatus(e.target.value as ApplicationStatus)
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select status</option>
                {nextStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            {statusesRequiringReason.includes(
              newStatus as ApplicationStatus
            ) && (
              <div className="animate-fadeIn">
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason..."
                  rows={3}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                !newStatus ||
                (statusesRequiringReason.includes(
                  newStatus as ApplicationStatus
                ) &&
                  !reason.trim())
              }
              className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                loading ||
                !newStatus ||
                (statusesRequiringReason.includes(
                  newStatus as ApplicationStatus
                ) &&
                  !reason.trim())
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\"
                    xmlns="http://www.w3.org/2000/svg\"
                    fill="none\"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25\"
                      cx="12\"
                      cy="12\"
                      r="10\"
                      stroke="currentColor\"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-slate-100 rounded-lg text-slate-600 text-sm">
          No further status updates are available for this application.
        </div>
      )}

      {/* Schedule Interview Button */}
      {showScheduleButton && (
        <button
          onClick={onScheduleInterview}
          className="mt-4 w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          <Calendar size={18} className="mr-2" />
          Schedule Interview
        </button>
      )}
    </div>
  );
};

export default StatusManager;
