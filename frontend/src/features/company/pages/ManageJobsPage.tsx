import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import CreateJobPage from "./CreateJobPage";
import { JobResponseDto, JobService } from "../services/jobServices";
import { handleApiError } from "../../../utils/apiError";
import LoadingIndicator from "../../admin/components/UserManagement/LoadingIndicator";

function ManageJobsPage() {
  const [jobs, setJobs] = useState<JobResponseDto[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await JobService.getJobs(page, limit);
      setJobs(result.jobs);
      setTotalPages(result.pagination.totalPages);
    } catch (err) {
      const parsedError = handleApiError(err, "Failed to fetch jobs");
      setError(
        parsedError.message || "Something went wrong while fetching jobs."
      );
      console.error("Fetch Jobs Error:", parsedError);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, refreshTrigger]);

  const handleJobUpdated = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <CreateJobPage onJobCreated={fetchJobs} />
      {jobs.length === 0 ? (
        <>
          <div className="text-center py-8 text-gray-500">
            No jobs found matching your criteria
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onJobUpdated={handleJobUpdated} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

function JobCard({
  job,
  onJobUpdated,
}: {
  job: JobResponseDto;
  onJobUpdated: () => void;
}) {
  return (
    <Link
      to={`/company/jobs/${job.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      onClick={onJobUpdated}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
            {job.jobType}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3">
          {job.description?.slice(0, 100)}...
        </p>
        <div className="flex items-center text-sm text-gray-500">
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{job.location}</span>
        </div>
      </div>
    </Link>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center items-center mt-8 space-x-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>
      <span className="text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
}

export default ManageJobsPage;
