import { useParams } from "react-router-dom";
import { JobService } from "../services/jobServices";
import { useEffect, useState } from "react";
import {
  FaDownload,
  FaRegEnvelope,
  FaUserCircle,
  FaFilter,
  FaSearch,
} from "react-icons/fa";
import { HiClock, HiChevronDown, HiOutlineDotsVertical } from "react-icons/hi";
import {
  BsCheckCircleFill,
  BsXCircleFill,
  BsClockHistory,
} from "react-icons/bs";

interface Applicant {
  _id: string;
  appliedAt: string;
  resumeUrl: string;
  status: string;
  user: {
    name: string;
    email: string;
    profilePicture: string;
  };
}

function JobApplicantsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    if (jobId) {
      fetchApplicants(jobId);
    }
  }, [jobId]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [applicants, searchTerm, statusFilter, sortOrder]);

  async function fetchApplicants(jobId: string) {
    try {
      setLoading(true);
      const res = await JobService.getJobApplicants(jobId);

      if (res.success) {
        setApplicants(res.data);
        setFilteredApplicants(res.data);
      }
    } catch (err) {
      setError("Failed to fetch applicants. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const applyFiltersAndSort = () => {
    let result = [...applicants];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (applicant) =>
          applicant.user.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          applicant.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((applicant) => applicant.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.appliedAt).getTime();
      const dateB = new Date(b.appliedAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredApplicants(result);
  };

  const formatApplicationDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatApplicationTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "applied":
        return <BsClockHistory className="text-blue-500" />;
      case "shortlisted":
        return <BsCheckCircleFill className="text-green-500" />;
      case "rejected":
        return <BsXCircleFill className="text-red-500" />;
      default:
        return <BsClockHistory className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600 font-medium">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <BsXCircleFill className="h-8 w-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">
            Error Loading Applicants
          </h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => fetchApplicants(jobId as string)}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Applicants</h1>
          <p className="mt-2 text-gray-600">
            {filteredApplicants.length} applicants found
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg appearance-none bg-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <HiChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg appearance-none bg-white"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <HiChevronDown className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {filteredApplicants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <FaFilter className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applicants found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Try changing your search criteria or filters"
                : "This job position has no applicants yet"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
            {filteredApplicants.map((applicant) => (
              <div
                key={applicant._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    {applicant.user.profilePicture ? (
                      <img
                        src={applicant.user.profilePicture}
                        alt={applicant.user.name}
                        className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FaUserCircle className="h-10 w-10 text-indigo-400" />
                      </div>
                    )}
                  </div>

                  {/* Applicant Details */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900">
                      {applicant.user.name}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaRegEnvelope className="flex-shrink-0" />
                        <a
                          href={`mailto:${applicant.user.email}`}
                          className="hover:text-indigo-600 transition-colors"
                        >
                          {applicant.user.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <HiClock className="flex-shrink-0" />
                        <div>
                          <span className="font-medium">
                            {formatApplicationDate(applicant.appliedAt)}
                          </span>
                          <span className="mx-1">at</span>
                          <span>
                            {formatApplicationTime(applicant.appliedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 md:mt-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                          applicant.status === "applied"
                            ? "bg-blue-50 text-blue-700"
                            : applicant.status === "shortlisted"
                            ? "bg-green-50 text-green-700"
                            : applicant.status === "rejected"
                            ? "bg-red-50 text-red-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {getStatusIcon(applicant.status)}
                        <span className="capitalize">{applicant.status}</span>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={applicant.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
                      >
                        <FaDownload className="flex-shrink-0" />
                        <span>Resume</span>
                      </a>

                      <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <HiOutlineDotsVertical className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobApplicantsPage;
