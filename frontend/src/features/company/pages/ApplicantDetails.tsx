import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "../components/ui/Toast";

import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import SecureDocViewer from "../../../components/SecureDocViewer";

import StatusManager from "../components/applicant/StatusManager";
import ApplicationTimeline from "../components/applicant/ApplicationTimeline";
import ScheduleInterviewModal from "../components/interview/ScheduleInterviewModal";
import RescheduleInterviewModal from "../components/interview/RescheduleInterviewModal";

import {
  ApplicantService,
  ApplicationDetailDTO,
} from "../services/applicantService";

function ApplicantDetails() {
  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState<ApplicationDetailDTO | null>(null);
  const [error, setError] = useState("");
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const fetchApplicantData = async () => {
    if (!applicationId) return;
    setLoading(true);
    try {
      const res = await ApplicantService.getApplicationDetails(applicationId);
      setApplicant(res);
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const refreshAndToast = (title: string, description: string) => {
    toast({ title, description, variant: "success" });
    fetchApplicantData();
  };

  useEffect(() => {
    fetchApplicantData();
  }, [applicationId]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchApplicantData} />;
  if (!applicant)
    return (
      <ErrorState
        message="No applicant data available"
        onRetry={fetchApplicantData}
      />
    );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline hover:text-blue-700 transition"
        >
          ← Back
        </button>

        <section className="bg-white rounded-xl shadow border border-slate-200 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={applicant.userProfilePicture || "/default.png"}
            alt={applicant.name || "Applicant Profile"}
            className="w-24 h-24 rounded-full object-cover border border-slate-200 shadow-sm"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-semibold text-slate-800">
              {applicant.name || "Unnamed User"}
            </h1>
            {applicant.username && (
              <Link
                to={`/in/${applicant.username}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View Public Profile
              </Link>
            )}
            {applicant.jobTitle && (
              <p className="text-slate-600 mt-1 text-sm">
                Applying for:{" "}
                <span className="font-medium">{applicant.jobTitle}</span>
              </p>
            )}
            {applicant.companyName && (
              <p className="text-slate-500 text-sm">{applicant.companyName}</p>
            )}
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Resume Viewer */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">
                  Resume
                </h2>
                {applicant.resumeUrl ? (
                  <SecureDocViewer resumeUrl={applicant.resumeUrl} />
                ) : (
                  <p className="text-slate-500 text-sm">No resume available</p>
                )}
              </div>
            </div>
          </aside>

          {/* Right: Application Info */}
          <main className="lg:col-span-8 space-y-6">
            {/* Application Status */}
            <section className="bg-white rounded-xl shadow border border-slate-200">
              <div className="px-4 py-5 border-b bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">
                  Application Status
                </h2>
              </div>
              <div className="p-4">
                <StatusManager
                  applicant={applicant}
                  applicationId={applicationId!}
                  onStatusUpdate={() =>
                    refreshAndToast(
                      "Status Updated",
                      "Application status successfully updated."
                    )
                  }
                  onScheduleInterview={() => setIsInterviewModalOpen(true)}
                  onRescheduleInterview={() => setIsRescheduleModalOpen(true)}
                />
              </div>
            </section>

            {/* Timeline */}
            <section className="bg-white rounded-xl shadow border border-slate-200">
              <div className="px-4 py-5 border-b bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">
                  Application History
                </h2>
              </div>
              <div className="p-4">
                {applicant.statusHistory?.length ? (
                  <ApplicationTimeline
                    statusHistory={applicant.statusHistory}
                  />
                ) : (
                  <p className="text-slate-500 text-sm">No history available</p>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Modals */}
      {applicationId && (
        <>
          <ScheduleInterviewModal
            isOpen={isInterviewModalOpen}
            onClose={() => setIsInterviewModalOpen(false)}
            applicationId={applicationId}
            userId={applicant.userId}
            jobId={applicant.jobId}
            onInterviewScheduled={() =>
              refreshAndToast(
                "Interview Scheduled",
                "Interview scheduled successfully."
              )
            }
          />
          <RescheduleInterviewModal
            isOpen={isRescheduleModalOpen}
            onClose={() => setIsRescheduleModalOpen(false)}
            applicationId={applicationId}
            userId={applicant.userId}
            jobId={applicant.jobId}
            currentInterviewTime={applicant.scheduledAt}
            onInterviewRescheduled={() =>
              refreshAndToast(
                "Reschedule Requested",
                "Candidate has been notified."
              )
            }
          />
        </>
      )}
    </div>
  );
}

export default ApplicantDetails;
