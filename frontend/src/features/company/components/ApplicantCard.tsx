import React, { useState, useRef, useEffect } from "react";
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
import UserAvatar from "../../admin/components/UserManagement/UserAvatar";

interface Application {
  _id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  job: {
    title: string;
  };
  status: "applied" | "shortlisted" | "rejected";
  appliedAt: string;
  resumeUrl: string;
  coverLetter?: string;
  statusHistory?: Array<{
    status: string;
    date: string;
    note?: string;
  }>;
}

interface ApplicantCardProps {
  applicant: Application;
  onStatusChange: (
    id: string,
    status: "applied" | "shortlisted" | "rejected",
    reason?: string
  ) => void;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({
  applicant,
  onStatusChange,
}) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const formatDate = (
    dateString: string,
    formatString: string = "MMMM d, yyyy"
  ) => {
    return format(new Date(dateString), formatString);
  };

  const handleReject = () => {
    onStatusChange(applicant._id, "rejected", rejectionReason);
    setIsRejectModalOpen(false);
    setRejectionReason("");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
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
            <div className="relative group">
              <UserAvatar
                name={applicant.user.name}
                imageSrc={applicant.user.avatar}
                size="lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-200" />
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">
                  {applicant.user.name}
                </h2>
                <a
                  href={`/company/job/application/${applicant._id}`}
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>View Profile</span>
                </a>
              </div>

              <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} className="flex-shrink-0" />
                  <a
                    href={`mailto:${applicant.user.email}`}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {applicant.user.email}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                  <Clock size={16} className="flex-shrink-0" />
                  <div>
                    <span className="font-medium">
                      {formatDate(applicant.appliedAt)}
                    </span>
                    <span className="mx-1">at</span>
                    <span>{formatDate(applicant.appliedAt, "h:mm a")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  Applied for:{" "}
                  <span className="font-medium text-gray-700">
                    {applicant.job.title}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-between border-t border-gray-100 pt-4">
            <StatusBadge status={applicant.status} />

            <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
              <a
                href={applicant.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
              >
                <Download size={16} className="flex-shrink-0" />
                <span>Resume</span>
              </a>

              {applicant.status === "applied" && (
                <div className="hidden sm:flex gap-2">
                  <button
                    onClick={() => onStatusChange(applicant._id, "shortlisted")}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                  >
                    <CheckSquare size={16} className="flex-shrink-0" />
                    <span>Shortlist</span>
                  </button>
                  <button
                    onClick={() => setIsRejectModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
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
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical size={18} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fadeIn">
                    {applicant.status === "applied" && (
                      <button
                        onClick={() => {
                          onStatusChange(applicant._id, "shortlisted");
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

          {/* Cover Letter Section */}
          {applicant.coverLetter && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  Cover Letter
                </h3>
                <button
                  onClick={() => setShowFullDetails(!showFullDetails)}
                  className="flex items-center text-xs text-indigo-600 hover:text-indigo-700"
                >
                  {showFullDetails ? (
                    <>
                      Hide <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      Show <ChevronDown size={14} />
                    </>
                  )}
                </button>
              </div>

              {showFullDetails && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                  {applicant.coverLetter}
                </div>
              )}
            </div>
          )}

          {/* Status History Section */}
          {showFullDetails &&
            applicant.statusHistory &&
            applicant.statusHistory.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Status History
                </h3>
                <div className="space-y-2">
                  {applicant.statusHistory.map((history, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-gray-50 rounded-lg gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <StatusBadge status={history.status as any} />
                        {history.note && (
                          <span className="text-xs text-gray-600">
                            {history.note.length > 50
                              ? `${history.note.substring(0, 50)}...`
                              : history.note}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(history.date, "MMM d, yyyy h:mm a")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {!applicant.statusHistory && !applicant.coverLetter && (
            <button
              onClick={() => setShowFullDetails(!showFullDetails)}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
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
            </button>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
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
              <span className="font-medium">{applicant.user.name}</span>. You
              can provide an optional reason below.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] text-sm"
            />

            <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm order-1 sm:order-2"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantCard;
