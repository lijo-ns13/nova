import { useEffect, useState } from "react";
import { AppliedJobResponseDTO, getAppliedJobs } from "../services/JobServices";

import { Loader, ChevronsLeft, ChevronsRight } from "lucide-react";
import ApplicationCard from "../componets/application/ApplicationCard";

const LIMIT = 5;

function AppliedJobsPage() {
  const [allJobs, setAllJobs] = useState<AppliedJobResponseDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(allJobs.length / LIMIT);

  const fetchAppliedJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAppliedJobs(); // Fetch all jobs once
      setAllJobs(res.data); // assuming data is array
    } catch (err) {
      setError("Failed to fetch applied jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const handleStatusChange = () => {
    fetchAppliedJobs();
  };

  const paginatedJobs = allJobs.slice(
    (currentPage - 1) * LIMIT,
    currentPage * LIMIT
  );

  return (
    <div className="p-4 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 text-center">
        Your Applications
      </h1>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin w-6 h-6 text-gray-600" />
        </div>
      )}

      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && !error && allJobs.length === 0 && (
        <div className="text-center text-gray-500">No applications found.</div>
      )}

      <div
        className="grid gap-4 sm:grid-cols-1 md:grid-cols-2"
        style={{ minHeight: "300px" }}
      >
        {paginatedJobs.map((job) => (
          <ApplicationCard
            key={job._id}
            appliedJob={job}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {!loading && allJobs.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronsLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-gray-600 text-sm font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-md border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Next
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default AppliedJobsPage;
