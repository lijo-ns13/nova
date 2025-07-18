import { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { ApplicantSummaryDTO, JobService } from "../../services/jobServices";

export const predefinedCandidateRejectionReasons = [
  "Does not meet the required qualifications",
  "Lacks relevant work experience",
  "Overqualified for the role",
  "Educational background does not match job requirements",
  "Insufficient technical skills",
  "Soft skills do not align with role expectations",
  "Cultural fit concerns",
  "Failed to demonstrate problem-solving abilities",
  "Poor communication during interview",
  "Did not perform well in technical assessment",
  "Incomplete or vague responses in interview",
  "Unable to explain past experiences clearly",
  "Resume contains inaccurate or misleading information",
  "Application was incomplete",
  "Duplicate application received",
  "Did not follow application instructions",
  "Candidate is not available within required joining timeframe",
  "Not willing to relocate",
  "Not available for full-time engagement",
  "Notice period is too long",
  "Lack of professionalism during interview",
  "Uncooperative or disinterested during the process",
  "Negative attitude or unwillingness to learn",
  "Issues found during background verification",
  "Unable to verify references or past employment",
  "Does not have legal authorization to work in required location",
  "Salary expectations do not align with budget",
  "Unrealistic career progression demands",
  "Position has been filled",
  "Hiring priorities have changed",
  "Internal candidate selected for the role",
  "Not a strategic fit at this time",
  "Withdrew application or did not respond further",
];

interface Props {
  applicant: ApplicantSummaryDTO;
  onStatusChange?: () => void;
}

function ApplicantCardCompany({ applicant, onStatusChange }: Props) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const navigate = useNavigate();

  const handleShortlist = async () => {
    try {
      await JobService.shortlistApplication(applicant.applicationId);
      toast.success("Applicant shortlisted");
      onStatusChange?.();
    } catch {
      toast.error("Failed to shortlist");
    }
  };

  const handleReject = async () => {
    const reason = selectedReason === "custom" ? customReason : selectedReason;
    if (!reason?.trim()) return toast.error("Rejection reason is required");

    try {
      await JobService.rejectApplication(
        applicant.applicationId,
        reason.trim()
      );
      toast.success("Applicant rejected");
      setShowRejectModal(false);
      setSelectedReason("");
      setCustomReason("");
      onStatusChange?.();
    } catch {
      toast.error("Failed to reject applicant");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 transition hover:shadow-md">
      <div className="flex items-center gap-4 mb-4">
        {/* <img
          src={applicant.profilePicture || "/default.png"}
          className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
        /> */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {applicant.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {applicant.email}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${
            applicant.status === "applied"
              ? "bg-blue-100 text-blue-800"
              : applicant.status === "shortlisted"
              ? "bg-green-100 text-green-800"
              : applicant.status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {applicant.status.replace(/_/g, " ")}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(applicant.appliedAt).toLocaleDateString()}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() =>
            navigate(`/company/job/application/${applicant.applicationId}`)
          }
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Eye size={16} className="inline mr-1" />
          View
        </button>

        {applicant.status === "applied" && (
          <>
            <button
              onClick={handleShortlist}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              <CheckCircle size={16} className="inline mr-1" />
              Shortlist
            </button>

            <button
              onClick={() => setShowRejectModal(true)}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <XCircle size={16} className="inline mr-1" />
              Reject
            </button>
          </>
        )}
      </div>

      {/* Modal for rejection */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-md shadow-lg max-w-md w-full border border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Reject Applicant
            </h3>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select a reason
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 mb-4 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
            >
              <option value="">Choose a reason</option>
              {predefinedCandidateRejectionReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
              <option value="custom">Other (custom reason)</option>
            </select>

            {selectedReason === "custom" && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter custom rejection reason"
                className="w-full px-3 py-2 mb-4 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white"
              />
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplicantCardCompany;
