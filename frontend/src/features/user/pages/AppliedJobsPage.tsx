import { useEffect, useState } from "react";
import { AppliedJobResponseDTO, getAppliedJobs } from "../services/JobServices";
import ApplicationCard from "../componets/application/ApplicationCard";

function AppliedJobsPage() {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJobResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAppliedJobs();
      setAppliedJobs(res.data);
    } catch (err) {
      setError("Failed to fetch applied jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {loading && (
        <div className="text-center text-gray-600">Loading applied jobs...</div>
      )}

      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && !error && appliedJobs.length === 0 && (
        <div className="text-center text-gray-500">No applications found.</div>
      )}

      <div className="grid gap-4">
        {appliedJobs.map((job) => (
          <ApplicationCard
            key={job._id}
            appliedJob={job}
            onStatusChange={fetchAppliedJobs}
          />
        ))}
      </div>
    </div>
  );
}

export default AppliedJobsPage;
