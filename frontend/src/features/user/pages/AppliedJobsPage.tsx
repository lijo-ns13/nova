import React, { useEffect, useState } from "react";
import {
  Briefcase as BriefcaseBusiness,
  ChevronLeft,
  Filter,
  RefreshCw,
} from "lucide-react";
import ApplicationCard from "../componets/application/ApplicationCard";
import Spinner from "../componets/ui/Spinner";
import EmptyState from "../componets/ui/EmptyState";
import ConfirmationModal from "../componets/ui/ConfirmationModal";
import { useToast } from "../componets/ui/ToastProvider";
import { getAppliedJobs } from "../services/JobServices";
interface AppliedJob {
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

const AppliedJobsPage: React.FC = () => {
  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    applicationId: string;
    action: "accept" | "reject";
  }>({ isOpen: false, applicationId: "", action: "accept" });

  const { showToast } = useToast();

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      const data = await getAppliedJobs();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
      showToast("error", "Failed to load your applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const refreshApplications = async () => {
    try {
      setIsRefreshing(true);
      const data = await getAppliedJobs();
      setApplications(data);
      showToast("success", "Applications refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing applications:", error);
      showToast("error", "Failed to refresh applications. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleInterviewResponse = async (
    applicationId: string,
    action: "accept" | "reject"
  ) => {
    try {
      setProcessingId(applicationId);
      await updateInterviewStatus(applicationId, {
        status:
          action === "accept"
            ? "interview_accepted_by_user"
            : "interview_rejected_by_user",
      });

      // Optimistically update UI
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? {
                ...app,
                status:
                  action === "accept"
                    ? "interview_accepted_by_user"
                    : "interview_rejected_by_user",
              }
            : app
        )
      );

      showToast(
        "success",
        `Interview ${
          action === "accept" ? "accepted" : "rejected"
        } successfully!`
      );
    } catch (error) {
      console.error(`Failed to ${action} interview:`, error);
      showToast("error", `Failed to ${action} interview. Please try again.`);
    } finally {
      setProcessingId(null);
    }
  };

  const openConfirmationModal = (
    applicationId: string,
    action: "accept" | "reject"
  ) => {
    setConfirmationModal({
      isOpen: true,
      applicationId,
      action,
    });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      applicationId: "",
      action: "accept",
    });
  };

  const confirmInterviewAction = () => {
    const { applicationId, action } = confirmationModal;
    handleInterviewResponse(applicationId, action);
    closeConfirmationModal();
  };

  const navigateToJobs = () => {
    showToast(
      "info",
      "This would navigate to the jobs page in a complete application"
    );
  };

  const navigateToApplicationDetail = (applicationId: string) => {
    showToast("info", `Viewing details for application ${applicationId}`);
  };

  const navigateToJobDetail = (jobId: string) => {
    showToast("info", `Viewing details for job ${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Your Applications
            </h1>
            <p className="text-gray-600">
              Manage and track your job applications
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={refreshApplications}
              disabled={isRefreshing}
              className="flex items-center px-3 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <RefreshCw
                size={16}
                className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              onClick={navigateToJobs}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <BriefcaseBusiness size={16} className="mr-2" />
              Browse Jobs
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <span className="text-gray-700 mr-2">Applications:</span>
            <span className="font-medium">{applications.length}</span>
          </div>
          <div className="flex mt-3 sm:mt-0">
            <button className="flex items-center text-gray-700 hover:text-gray-900">
              <Filter size={16} className="mr-1" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={<BriefcaseBusiness size={48} />}
          title="No Applications Yet"
          description="You haven't applied to any jobs yet. Browse available jobs and apply to get started."
          actionText="Browse Jobs"
          onAction={navigateToJobs}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              processingId={processingId}
              onViewJobDetails={navigateToJobDetail}
              onAcceptInterview={(id) => openConfirmationModal(id, "accept")}
              onRejectInterview={(id) => openConfirmationModal(id, "reject")}
              onClick={() => navigateToApplicationDetail(application._id)}
            />
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={`${
          confirmationModal.action === "accept" ? "Accept" : "Reject"
        } Interview Confirmation`}
        message={`Are you sure you want to ${
          confirmationModal.action
        } this interview? ${
          confirmationModal.action === "reject"
            ? "This action may impact your candidacy for future positions."
            : "By accepting, you confirm your availability for the scheduled time."
        }`}
        confirmText={
          confirmationModal.action === "accept"
            ? "Yes, Accept Interview"
            : "Yes, Reject Interview"
        }
        cancelText="Cancel"
        confirmType={
          confirmationModal.action === "accept" ? "success" : "danger"
        }
        onConfirm={confirmInterviewAction}
        onCancel={closeConfirmationModal}
      />
    </div>
  );
};

export default AppliedJobsPage;
