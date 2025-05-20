import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAppliedJobs } from "../services/JobServices";
import Spinner from "../../company/components/Spinner";
import EmptyState from "../componets/EmptyState";

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
}

const AppliedJobsPage: React.FC = () => {
  const [applications, setApplications] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const data = await getAppliedJobs();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Applications</h1>
        <button
          onClick={() => navigate("/jobs")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Browse Jobs
        </button>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No Applications Yet"
          description="You haven't applied to any jobs yet. Browse available jobs and apply to get started."
          actionText="Browse Jobs"
          onAction={() => navigate("/jobs")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((application) => (
            <div
              key={application._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300"
              onClick={() => navigate(`/jobs/applications/${application._id}`)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {application.job.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mt-2">
                    {application.job.description.replace(/[\n]/g, " ")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {application.job.jobType}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {application.job.location}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-end">
                  <span className="text-sm text-gray-500 mt-2">
                    Applied:{" "}
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Submitted Resume
                </a>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/jobs/${application.job._id}`);
                  }}
                >
                  View Job Details
                </button>
              </div>

              {/* Application Status */}
              <div className="mt-4">
                <span className="text-sm font-medium text-gray-700">
                  Status:{" "}
                  <span className="capitalize text-blue-600">
                    {application.status.replace(/_/g, " ")}
                  </span>
                </span>
              </div>

              {/* Rejection Reason */}
              {application.status === "rejected" &&
                application.rejectionReason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                    <strong>Rejection Reason:</strong>{" "}
                    {application.rejectionReason}
                  </div>
                )}

              {/* Interview Action Buttons */}
              {application.status === "interview_scheduled" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Accept Interview:", application._id);
                      // API call here
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
                  >
                    Accept Interview
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Reject Interview:", application._id);
                      // API call here
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition text-sm"
                  >
                    Reject Interview
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobsPage;
