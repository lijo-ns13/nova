import { useEffect, useState } from "react";
import { AppliedJobResponseDTO, getAppliedJobs } from "../services/JobServices";

import { Loader, ChevronsLeft, ChevronsRight } from "lucide-react";
import ApplicationCard from "../componets/application/ApplicationCard";
import LoadingIndicator from "../../admin/components/UserManagement/LoadingIndicator";

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
      const res = await getAppliedJobs();
      setAllJobs(res.data);
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
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center">
        My Applications
      </h1>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center py-20">
          <LoadingIndicator />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-center">
          {error}
        </div>
      )}

      {/* No applications */}
      {!loading && !error && allJobs.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          You have not applied to any jobs yet.
        </div>
      )}

      {/* Applications Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {paginatedJobs.map((job) => (
          <ApplicationCard
            key={job._id}
            appliedJob={job}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* Pagination */}
      {!loading && allJobs.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-10 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 transition"
          >
            <ChevronsLeft className="w-5 h-5" />
            Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg border bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Next
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default AppliedJobsPage;
