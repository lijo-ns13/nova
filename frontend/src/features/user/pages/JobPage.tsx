import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import JobCard from "../componets/job/JobCard";
import FilterPanel from "../componets/job/FilterPanel";
import Pagination from "../componets/job/Pagination";
import { getJobs } from "../services/JobServices";
import { Job, FilterOptions, PaginationState } from "../types/jobTypes";

function JobPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [locationTerm, setLocationTerm] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<FilterOptions>({
    jobType: [],
    employmentType: [],
    experienceLevel: [],
    minSalary: "",
    maxSalary: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [pagination.page, filters]);

  async function fetchJobs() {
    setIsLoading(true);
    try {
      const res = await getJobs({
        ...filters,
        title: searchTerm,
        location: locationTerm,
        page: pagination.page,
        limit: pagination.limit,
      });
      setJobs(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error("Error fetching jobs", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 });
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters({
      jobType: [],
      employmentType: [],
      experienceLevel: [],
      minSalary: "",
      maxSalary: "",
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Find Your Next Opportunity
        </h1>

        {/* Search and filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by job title or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>

          {/* Location Search */}
          <div className="relative flex-grow">
            <input
              type="text"
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by location"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </div>

          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition-colors duration-200"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5 mr-2" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            fetchJobs={fetchJobs}
            clearFilters={clearFilters}
          />
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {jobs.length > 0 && (
        <Pagination
          pagination={pagination}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default JobPage;
