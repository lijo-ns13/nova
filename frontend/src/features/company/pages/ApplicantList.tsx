import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Filter, Search, X } from "lucide-react";

import { ApplicantSummaryDTO, JobService } from "../services/jobServices";
import Spinner from "../components/Spinner";

import SearchBar from "../../admin/components/UserManagement/SearchBar";
import Pagination from "../../admin/components/UserManagement/Pagination";
import ApplicantCard from "../components/ApplicantCard";
import ApplicantCardCompany from "../components/applicant/ApplicantCardCompany";
import LoadingIndicator from "../../admin/components/UserManagement/LoadingIndicator";

export default function ApplicantList() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState<ApplicantSummaryDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const limit = 10;
  const navigate = useNavigate();

  const fetchApplicants = async () => {
    if (!jobId) return;

    setLoading(true);
    try {
      const response = await JobService.getJobApplicants(jobId, page, limit, {
        search,
        status,
        dateFrom,
        dateTo,
      });
      setApplicants(response.applications);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalApplications);
    } catch (error) {
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async (applicationId: string) => {
    try {
      await JobService.shortlistApplication(applicationId);
      toast.success("Application shortlisted");
      fetchApplicants();
    } catch (error) {
      toast.error("Failed to shortlist");
    }
  };

  const handleReject = async (applicationId: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason?.trim()) return toast.error("Rejection reason is required");

    try {
      await JobService.rejectApplication(applicationId, reason.trim());
      toast.success("Application rejected");
      fetchApplicants();
    } catch (error) {
      toast.error("Failed to reject application");
    }
  };

  const handleSearchClear = () => {
    setSearch("");
    setPage(1);
    fetchApplicants();
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchApplicants();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    fetchApplicants();
  };

  useEffect(() => {
    fetchApplicants();
  }, [page, jobId]);

  if (loading) return <LoadingIndicator />;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline hover:text-blue-700 transition"
      >
        ← Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Job Applicants
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage and review all applicants for this position
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={handleSearchClear}
          placeholder="Search applicants by name or email..."
        />

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>

          <button
            onClick={handleFilterSubmit}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 border border-gray-200 dark:border-gray-700">
          <form
            onSubmit={handleFilterSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200"
              >
                <option value="">All Statuses</option>
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="interview_reschedule_accepted">
                  Interview Reschedule Accepted
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-gray-200"
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Applicants List */}
      {applicants.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center border border-gray-200 dark:border-gray-700">
          <div className="mx-auto max-w-md">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No applicants found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {search || status || dateFrom || dateTo
                ? "Try adjusting your search or filter criteria"
                : "There are no applicants for this position yet"}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {applicants.map((applicant) => (
              <ApplicantCardCompany
                key={applicant.applicationId}
                applicant={applicant}
                onStatusChange={fetchApplicants}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
