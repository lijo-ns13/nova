import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Application, ApplicationStatus } from "../types/applicationTypes";
import ApplicantHeader from "../components/interview/ApplicantHeader";
import DetailCard from "../components/interview/DetailCard";
import ResumeCard from "../components/interview/ResumeCard";
import StatusActions from "../components/interview/StatusActions";
import LoadingSpinner from "../components/interview/LoadingSpinner";
import ErrorDisplay from "../components/interview/ErrorDisplay";
import SkeletonLoader from "../components/interview/SkeletonLoader";
import { formatDate } from "../util/dateUtils";
import companyAxios from "../../../utils/companyAxios";

// This is a mock implementation for demonstration purposes
// In a real app, this would come from react-router-dom

const ApplicantDetailPage: React.FC = () => {
  // In a real app with React Router, use useParams()
  // For this example we're using a mock to show functionality
  const { applicationId } = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplication() {
      setLoading(true);
      setError(null);

      try {
        const res = await companyAxios.get(`/application/${applicationId}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          setApplication(res.data.application);
        } else {
          setError("Failed to load application");
        }
      } catch (err) {
        setError("Failed to load application");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    // In a real application, uncomment this:
    fetchApplication();
  }, [applicationId]);

  const handleRetry = () => {
    // Refetch the application data
    setLoading(true);
    setError(null);
  };

  const handleInterviewScheduled = () => {
    // Update the local application status
    if (application) {
      setApplication({
        ...application,
        status: ApplicationStatus.INTERVIEW_SCHEDULED,
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <ErrorDisplay message={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100 text-center">
          <p className="text-yellow-700">
            No application found with the provided ID.
          </p>
          <Link
            to="/applications"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            ← Back to Applications
          </Link>
        </div>
      </div>
    );
  }

  const { user, resumeUrl, status, appliedAt, job, rejectionReason } =
    application;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Back Link */}
      <Link
        to="/applications"
        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Applications
      </Link>

      {/* Applicant Header with Name and Status */}
      <ApplicantHeader user={user} status={status} />

      {/* Application Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job Details */}
        <DetailCard title="Job Details">
          <div className="space-y-2">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Position</h4>
              <p className="text-gray-900">{job.title}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Applied On</h4>
              <p className="text-gray-900">{formatDate(appliedAt)}</p>
            </div>
          </div>
        </DetailCard>

        {/* Resume */}
        <ResumeCard resumeUrl={resumeUrl} />
      </div>

      {/* Status Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">
          Application Status
        </h3>
        <StatusActions
          status={status}
          rejectionReason={rejectionReason}
          applicationId={application._id}
          userId={user._id}
          onInterviewScheduled={handleInterviewScheduled}
        />
      </div>
    </div>
  );
};

export default ApplicantDetailPage;
