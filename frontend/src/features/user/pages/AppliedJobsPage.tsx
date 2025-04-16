import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAppliedJobs } from "../services/JobServices";
import JobCard from "../componets/JobCard";
import Spinner from "../../company/components/Spinner";
import EmptyState from "../componets/EmptyState";

interface AppliedJob {
  _id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  appliedAt: Date;
  status: "pending" | "reviewed" | "interview" | "rejected" | "accepted";
  isSaved: boolean;
}

const AppliedJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const data = await getAppliedJobs();
        const transformedJobs = data.map((job: any) => ({
          _id: job._id,
          title: job.title,
          company: job.company.name || job.company,
          description: job.description || "No description available",
          location: job.location,
          salary: job.salary,
          appliedAt: job.applications[0]?.appliedAt || new Date(),
          status: job.applications[0]?.status || "pending",
          isSaved: job.isSaved || false,
        }));
        setJobs(transformedJobs);
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

      {jobs.length === 0 ? (
        <EmptyState
          title="No Applications Yet"
          description="You haven't applied to any jobs yet. Browse available jobs and apply to get started."
          actionText="Browse Jobs"
          onAction={() => navigate("/jobs")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              showSaveButton={true}
              isSaved={job.isSaved}
              onSaveToggle={() => {}}
              showStatus={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobsPage;
