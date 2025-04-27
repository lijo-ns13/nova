import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSavedJobs, unsaveJob } from "../services/JobServices";
import JobCard from "../componets/JobCard";
import Spinner from "../../company/components/Spinner";
import EmptyState from "../componets/EmptyState";
import { toast } from "react-toastify";

interface SavedJob {
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
  type?: string;
  createdAt: Date;
}

const SavedJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const data = await getSavedJobs();
      const transformedJobs = data.map((job: any) => ({
        _id: job._id,
        title: job.title,
        company: job.company.name || job.company,
        description: job.description || "No description available",
        location: job.location,
        salary: job.salary,
        type: job.type,
        createdAt: job.createdAt,
      }));
      setJobs(transformedJobs);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      toast.error("Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId: string) => {
    try {
      await unsaveJob(jobId);
      setJobs(jobs.filter((job) => job._id !== jobId));
      toast.success("Job removed from saved jobs");
    } catch (error) {
      console.error("Error unsaving job:", error);
      toast.error("Failed to unsave job");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Saved Jobs</h1>
        <button
          onClick={() => navigate("/jobs")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Browse Jobs
        </button>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="No Saved Jobs"
          description="You haven't saved any jobs yet. Save jobs to easily access them later."
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
              isSaved={true}
              onSaveToggle={() => handleUnsaveJob(job._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobsPage;
