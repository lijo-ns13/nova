import { useEffect, useState } from "react";
import { AppliedJobResponseDTO, getAppliedJobs } from "../services/JobServices";
import ApplicationCard from "../componets/application/ApplicationCard";

function AppliedJobsPage() {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJobResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      const res = await getAppliedJobs();
      setAppliedJobs(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {!loading && appliedJobs.length === 0 && <p>No applications found.</p>}
      {appliedJobs.map((job) => (
        <ApplicationCard
          key={job._id}
          appliedJob={job}
          onStatusUpdate={fetchAppliedJobs}
        />
      ))}
    </div>
  );
}

export default AppliedJobsPage;
