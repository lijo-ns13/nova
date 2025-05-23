import React from "react";
import { Calendar, MapPin, Eye, Clock } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    description: string;
    location: string;
    jobType: string;
  };
  appliedAt: string;
  status:
    | "applied"
    | "shortlisted"
    | "interview_scheduled"
    | "rejected"
    | "interview_cancelled"
    | "interview_accepted_by_user"
    | "interview_rejected_by_user"
    | "interview_failed"
    | "interview_passed"
    | "offered"
    | "selected";
  resumeUrl: string;
  rejectionReason?: string;
  scheduledAt?: Date | string;
}

interface ApplicationCardProps {
  application: Application;
  processingId: string | null;
  onViewJobDetails: (jobId: string) => void;
  onAcceptInterview: (applicationId: string) => void;
  onRejectInterview: (applicationId: string) => void;
  onClick: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  processingId,
  onViewJobDetails,
  onAcceptInterview,
  onRejectInterview,
  onClick,
}) => {
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

        {/* Rejection Reason */}
        {application.status === "rejected" && application.rejectionReason && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md animate-fadeIn">
            <strong>Rejection Reason:</strong> {application.rejectionReason}
          </div>
        )}

        {/* Interview Section */}
        {application.status === "interview_scheduled" && (
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
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap gap-3 justify-between items-center border-t pt-4">
          {/* <a
            href={application.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <FileText size={16} className="mr-1" />
            View Resume
          </a> */}
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
