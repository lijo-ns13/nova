import React, { useEffect, useState } from "react";
import { FileText, MapPin, Briefcase, Award } from "lucide-react";

import { useParams } from "react-router-dom";
import { Applicant } from "../types/applicant";
import { getApplicantById } from "../services/newApplicantService";
import { toast } from "../components/ui/Toast";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import ApplicantHeader from "../components/applicant/ApplicantHeader";
import StatusManager from "../components/applicant/StatusManager";
import ApplicationTimeline from "../components/applicant/ApplicationTimeline";
import ScheduleInterviewModal from "../components/interview/ScheduleInterviewModal";
import RescheduleInterviewModal from "../components/interview/RescheduleInterviewModal";
import SecureDocumentViewer from "../../../components/SecureDocumentViewer";
function ApplicantDetails() {
  const [loading, setLoading] = useState<boolean>(true);
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [error, setError] = useState<string>("");
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const { applicationId } = useParams();

  const fetchApplicantData = async () => {
    if (!applicationId) return;

    setLoading(true);
    try {
      const res = await getApplicantById(applicationId);
      if (res.success) {
        setApplicant(res.data);
      } else {
        setError("Failed to fetch applicant details.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };
  const handleInterviewRescheduled = () => {
    toast({
      title: "Reschedule Request Sent",
      description: "Your reschedule request has been sent to the candidate",
      variant: "success",
    });
    fetchApplicantData();
  };
  const handleStatusUpdateSuccess = () => {
    toast({
      title: "Status Updated",
      description: "Application status has been successfully updated",
      variant: "success",
    });
    fetchApplicantData();
  };

  const handleInterviewScheduled = () => {
    toast({
      title: "Interview Scheduled",
      description: "Interview has been scheduled successfully",
      variant: "success",
    });
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
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <ApplicantHeader applicant={applicant} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-6">
                {/* Job Details Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 border-b border-slate-200 bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-800">
                      Job Details
                    </h2>
                  </div>
                  <div className="p-4 sm:p-6 space-y-4">
                    <h3 className="text-lg font-medium text-slate-900">
                      {applicant.job.title}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center text-slate-600">
                        <MapPin
                          size={18}
                          className="mr-2 text-slate-400 flex-shrink-0"
                        />
                        <span className="text-sm">
                          {applicant.job.location}
                        </span>
                      </div>

                      <div className="flex items-center text-slate-600">
                        <Briefcase
                          size={18}
                          className="mr-2 text-slate-400 flex-shrink-0"
                        />
                        <span className="text-sm">{applicant.job.jobType}</span>
                      </div>

                      <div className="flex items-center text-slate-600">
                        <Award
                          size={18}
                          className="mr-2 text-slate-400 flex-shrink-0"
                        />
                        <span className="text-sm">
                          {applicant.job.experienceLevel}
                        </span>
                      </div>
                    </div>

                    {applicant.job.salary.isVisibleToApplicants && (
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                        <div className="text-sm font-medium text-slate-700">
                          Salary Range
                        </div>
                        <div className="text-lg font-semibold text-slate-900 mt-1">
                          {applicant.job.salary.currency}{" "}
                          {applicant.job.salary.min.toLocaleString()} -{" "}
                          {applicant.job.salary.max.toLocaleString()}
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      {/* <a
                        href={applicant.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition duration-150 ease-in-out text-sm"
                      >
                        <FileText size={16} className="mr-2" />
                        View Resume
                      </a> */}
                      <SecureDocumentViewer mediaId={applicant.resumeMediaId} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-6">
              {/* Status Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Application Status
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
                  {applicationId && (
                    <StatusManager
                      applicant={applicant}
                      applicationId={applicationId}
                      onStatusUpdate={handleStatusUpdateSuccess}
                      onScheduleInterview={() => setIsInterviewModalOpen(true)}
                      onRescheduleInterview={() =>
                        setIsRescheduleModalOpen(true)
                      }
                    />
                  )}
                </div>
              </div>

              {/* Timeline Section */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-slate-200 bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-800">
                    Application History
                  </h2>
                </div>
                <div className="p-4 sm:p-6">
                  <ApplicationTimeline
                    statusHistory={applicant.statusHistory}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Modal */}
      {applicationId && (
        <>
          <ScheduleInterviewModal
            isOpen={isInterviewModalOpen}
            onClose={() => setIsInterviewModalOpen(false)}
            applicationId={applicationId}
            userId={applicant.user._id}
            onInterviewScheduled={handleInterviewScheduled}
          />
          <RescheduleInterviewModal
            isOpen={isRescheduleModalOpen}
            onClose={() => setIsRescheduleModalOpen(false)}
            applicationId={applicationId}
            userId={applicant.user._id}
            currentInterviewTime={applicant.scheduledAt}
            onInterviewRescheduled={handleInterviewRescheduled}
          />
        </>
      )}
    </div>
  );
}

export default ApplicantDetails;
