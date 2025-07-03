import React, { useEffect, useState } from "react";
import { Calendar, MapPin, Eye, Clock } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import { ApplicationStatus } from "../../../company/types/applicant";
import {
  acceptReschedule,
  getRescheduleSlots,
} from "../../services/InterviewRescheduleService";

export interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    description: string;
    location: string;
    jobType: string;
  };
  appliedAt: string;
  status: ApplicationStatus;
  resumeUrl: string;
  statusHistory: {
    status: ApplicationStatus;
    changedAt: string;
    reason?: string;
  }[];
  scheduledAt?: Date | string;
}

interface ApplicationCardProps {
  application: Application;
  processingId: string | null;
  onViewJobDetails: (jobId: string) => void;
  onAcceptInterview: (applicationId: string) => void;
  onRejectInterview: (applicationId: string) => void;
  onClick: () => void;
  onUpdateSuccess: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  processingId,
  onViewJobDetails,
  onAcceptInterview,
  onRejectInterview,
  onClick,
  onUpdateSuccess,
}) => {
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [localProcessing, setLocalProcessing] = useState<
    "accept" | "reject" | null
  >(null);

  const getRejectionReason = () => {
    if (application.status === ApplicationStatus.REJECTED) {
      const rejectionEntry = application.statusHistory.find(
        (entry) => entry.status === ApplicationStatus.REJECTED && entry.reason
      );
      return rejectionEntry?.reason;
    }
    return null;
  };

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const res = await getRescheduleSlots(application._id);
      if (res.success && res.data) {
        setTimeSlots(res.data);
        setError(null);
      } else {
        setError(res.message || "Failed to load time slots");
      }
    } catch (err) {
      setError("Failed to load time slots");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleRescheduleResponse = async (
    action: "accept" | "reject",
    slot?: string
  ) => {
    setLocalProcessing(action);
    try {
      let response;
      if (action === "accept" && slot) {
        response = await acceptReschedule(
          application._id,
          "interview_reschedule_accepted",
          slot
        );
      } else {
        response = await acceptReschedule(
          application._id,
          "interview_reschedule_rejected"
        );
      }

      if (response.success) {
        onClick();
        onUpdateSuccess();
      } else {
        setError(response.message || "Failed to process request");
      }
    } catch (err) {
      setError("Failed to process request");
    } finally {
      setLocalProcessing(null);
    }
  };

  useEffect(() => {
    if (
      application.status === ApplicationStatus.INTERVIEW_RESCHEDULE_PROPOSED
    ) {
      fetchSlots();
    }
  }, [application.status]);

  const shouldShowInterviewTime = () => {
    return [
      ApplicationStatus.INTERVIEW_SCHEDULED,
      ApplicationStatus.INTERVIEW_RESCHEDULED,
      ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER,
      ApplicationStatus.INTERVIEW_RESCHEDULE_ACCEPTED,
    ].includes(application.status);
  };

  const rejectionReason = getRejectionReason();

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {application.job.title}
            </h3>
            <p className="text-gray-600 line-clamp-2 mb-4">
              {application.job.description.replace(/\n/g, " ")}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin size={16} className="mr-1 text-gray-500" />
                <span>{application.job.location}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1 text-gray-500" />
                <span>{application.job.jobType}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1 text-gray-500" />
                <span>
                  Applied:{" "}
                  {new Date(application.appliedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <StatusBadge status={application.status} />
            </div>
          </div>
        </div>

        {rejectionReason && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md animate-fadeIn">
            <strong>Rejection Reason:</strong> {rejectionReason}
          </div>
        )}

        {shouldShowInterviewTime() && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-md">
            <div className="flex items-center mb-2">
              <Calendar size={18} className="mr-2" />
              <p className="font-medium">
                Interview Scheduled:{" "}
                {application.scheduledAt
                  ? new Date(application.scheduledAt).toLocaleString()
                  : "Not specified"}
              </p>
            </div>

            {application.status === ApplicationStatus.INTERVIEW_SCHEDULED && (
              <div className="flex flex-wrap gap-3 mt-3">
                <button
                  disabled={processingId === application._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAcceptInterview(application._id);
                  }}
                  className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
                    processingId === application._id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {processingId === application._id ? (
                    <span className="flex items-center">
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
                      Processing...
                    </span>
                  ) : (
                    "Accept Interview"
                  )}
                </button>
                <button
                  disabled={processingId === application._id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRejectInterview(application._id);
                  }}
                  className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                    processingId === application._id
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {processingId === application._id
                    ? "Processing..."
                    : "Reject Interview"}
                </button>
              </div>
            )}
          </div>
        )}

        {application.status ===
          ApplicationStatus.INTERVIEW_RESCHEDULE_PROPOSED && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 text-purple-800 rounded-md">
            <div className="flex items-center mb-2">
              <Calendar size={18} className="mr-2" />
              <p className="font-medium">
                New interview time has been proposed. Please select one of the
                available slots:
              </p>
            </div>

            {loadingSlots ? (
              <div className="flex justify-center items-center py-4">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-purple-500"
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
                Loading available time slots...
              </div>
            ) : error ? (
              <div className="text-red-500 mb-4">{error}</div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedTimeSlot === slot
                          ? "bg-purple-100 border-purple-500"
                          : "hover:bg-gray-50 border-gray-200"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTimeSlot(slot);
                      }}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          checked={selectedTimeSlot === slot}
                          onChange={() => setSelectedTimeSlot(slot)}
                          className="mr-2"
                        />
                        <span>{new Date(slot).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    disabled={!selectedTimeSlot || localProcessing !== null}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRescheduleResponse("accept", selectedTimeSlot);
                    }}
                    className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center ${
                      !selectedTimeSlot || localProcessing !== null
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {localProcessing === "accept" ? (
                      <>
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
                        Processing...
                      </>
                    ) : (
                      "Accept New Time"
                    )}
                  </button>
                  <button
                    disabled={localProcessing !== null}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRescheduleResponse("reject");
                    }}
                    className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center ${
                      localProcessing !== null
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {localProcessing === "reject" ? (
                      <>
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
                        Processing...
                      </>
                    ) : (
                      "Reject Reschedule"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3 justify-between items-center border-t pt-4">
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              onViewJobDetails(application.job._id);
            }}
          >
            <Eye size={16} className="mr-1" />
            View Job Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
