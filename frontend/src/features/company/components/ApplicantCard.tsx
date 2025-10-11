import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for SPA navigation without refresh
import { format } from "date-fns";
import {
  Download,
  Mail,
  MoreVertical,
  Clock,
  ExternalLink,
  XCircle,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  XSquare,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { ApplicantListResponse } from "../types/applicant";
import { ApplicationStatus } from "../../../constants/applicationStatus";

interface ApplicantCardProps {
  applicant: ApplicantListResponse;
  onStatusChange: (
    id: string,
    status: "applied" | "shortlisted" | "rejected",
    reason?: string
  ) => Promise<void>; // Make it async to handle updates without refresh
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({
  applicant,
  onStatusChange,
}) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state for better UX
  const menuRef = useRef<HTMLDivElement>(null);

  const formatDate = (
    dateString: string,
    formatString: string = "MMMM d, yyyy"
  ) => {
    return format(new Date(dateString), formatString);
  };

  const handleStatusChange = async (
    status: "applied" | "shortlisted" | "rejected",
    reason?: string
  ) => {
    setIsLoading(true);
    try {
      await onStatusChange(applicant.applicationId, status, reason);
    } catch (error) {
      console.error("Status change failed:", error);
      // Optionally add error toast or feedback
    } finally {
      setIsLoading(false);
      setIsRejectModalOpen(false);
      setRejectionReason("");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative group flex-shrink-0">
              <img
                src={applicant.profilePicture || "/default.png"}
                alt={applicant.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-200" />
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {applicant.name}
                </h2>
                <Link
                  to={`/company/job/application/${applicant.applicationId}`}
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>View Applicant</span>
                </Link>
              </div>

              <div className="mt-2 flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} className="flex-shrink-0" />
                  <a
                    href={`mailto:${applicant.email}`}
                    className="hover:text-indigo-600 transition-colors truncate"
                  >
                    {applicant.email}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                  <Clock size={16} className="flex-shrink-0" />
                  <div className="truncate">
                    <span className="font-medium">
                      {formatDate(applicant.appliedAt)}
                    </span>
                    <span className="mx-1">at</span>
                    <span>{formatDate(applicant.appliedAt, "h:mm a")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-between border-t border-gray-100 pt-4">
            <StatusBadge status={applicant.status as ApplicationStatus} />

            <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
              {applicant.status === "applied" && (
                <div className="hidden sm:flex gap-2">
                  <button
                    onClick={() => handleStatusChange("shortlisted")}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckSquare size={16} className="flex-shrink-0" />
                    <span>Shortlist</span>
                  </button>
                  <button
                    onClick={() => setIsRejectModalOpen(true)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XSquare size={16} className="flex-shrink-0" />
                    <span>Reject</span>
                  </button>
                </div>
              )}

              {/* Mobile menu dropdown */}
              <div className="relative sm:hidden" ref={menuRef}>
                <button
                  onClick={toggleMenu}
                  disabled={isLoading}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  aria-label="More options"
                >
                  <MoreVertical size={18} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fadeIn">
                    {applicant.status === "applied" && (
                      <button
                        onClick={() => {
                          handleStatusChange("shortlisted");
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <CheckSquare size={16} className="text-green-600" />
                        Mark as Shortlisted
                      </button>
                    )}

                    {applicant.status === "applied" && (
                      <button
                        onClick={() => {
                          setIsRejectModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <XSquare size={16} className="text-red-600" />
                        Reject Application
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Optional: Toggle for more details - uncomment and adapt if needed */}
          {/* <button
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 mx-auto sm:mx-0"
          >
            {showFullDetails ? (
              <>
                Show Less <ChevronUp size={14} />
              </>
            ) : (
              <>
                Show More <ChevronDown size={14} />
              </>
            )}
          </button> */}
        </div>
      </div>

      {/* Rejection Modal - Improved with better responsiveness */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
          <div
            className="bg-white rounded-lg p-5 max-w-md w-full mx-auto animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Reject Application
              </h3>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              You are about to reject the application from{" "}
              <span className="font-medium">{applicant.name}</span>. You can
              provide an optional reason below.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] text-sm resize-vertical"
            />

            <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors order-2 sm:order-1 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusChange("rejected", rejectionReason)}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm order-1 sm:order-2 disabled:opacity-50"
              >
                {isLoading ? "Rejecting..." : "Reject Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantCard;
