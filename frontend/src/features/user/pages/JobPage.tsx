import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobs } from "../services/JobServices";
import {
  Briefcase,
  MapPin,
  Clock,
  Building,
  DollarSign,
  Search,
  Filter,
} from "lucide-react";

// Define TypeScript interface for job data
interface Salary {
  currency: string;
  min: number;
  max: number;
  isVisibleToApplicants: boolean;
}

interface Skill {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Company {
  _id: string;
  companyName: string;
  about: string;
  email: string;
  industryType: string;
  foundedYear: number;
  location: string;
  isVerified: boolean;
  isBlocked: boolean;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Job {
  _id: string;
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  employmentType: string;
  experienceLevel: string;
  skillsRequired: Skill[];
  benefits: string[];
  perks: string[];
  applicationDeadline: string;
  company: Company;
  salary: Salary;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function JobPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setIsLoading(true);
    try {
      const res = await getJobs();
      setJobs(res);
    } catch (err) {
      console.error("Error fetching jobs", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Format salary range
  const formatSalary = (salary: Salary) => {
    if (!salary.isVisibleToApplicants) return "Salary not disclosed";
    return `${
      salary.currency
    } ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  // Get experience level badge color
  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case "entry":
        return "bg-green-100 text-green-800";
      case "mid":
        return "bg-blue-100 text-blue-800";
      case "senior":
        return "bg-purple-100 text-purple-800";
      case "lead":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get job type badge color
  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "remote":
        return "bg-teal-100 text-teal-800";
      case "onsite":
        return "bg-amber-100 text-amber-800";
      case "hybrid":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get employment type badge color
  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-blue-100 text-blue-800";
      case "part-time":
        return "bg-purple-100 text-purple-800";
      case "contract":
        return "bg-yellow-100 text-yellow-800";
      case "internship":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date to relative time (e.g., "2 days ago")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.companyName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              placeholder="Search jobs, companies, or locations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm hover:bg-gray-50">
            <Filter className="h-5 w-5 mr-2" />
            <span>Filters</span>
          </button>
        </div>
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
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Link
              to={`/jobs/${job._id}`}
              key={job._id}
              className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="p-6">
                <div className="sm:flex sm:items-start sm:justify-between">
                  <div className="sm:flex sm:items-start">
                    {/* Company logo placeholder */}
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center mr-4 hidden sm:flex">
                      <Building className="h-6 w-6 text-gray-400" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h2>
                      <p className="text-gray-600 mb-2">
                        {job.company.companyName}
                      </p>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}</span>
                        </div>

                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span className="capitalize">
                            {job.employmentType.replace("-", " ")}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>{formatSalary(job.salary)}</span>
                        </div>

                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{getRelativeTime(job.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getJobTypeColor(
                            job.jobType
                          )}`}
                        >
                          {job.jobType}
                        </span>

                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEmploymentTypeColor(
                            job.employmentType
                          )}`}
                        >
                          {job.employmentType.replace("-", " ")}
                        </span>

                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExperienceLevelColor(
                            job.experienceLevel
                          )}`}
                        >
                          {job.experienceLevel} level
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 hidden sm:block">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100">
                      View Details
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                </div>

                {job.skillsRequired.length > 0 && (
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.map((skill) => (
                        <span
                          key={skill._id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {skill.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Application deadline:{" "}
                    {new Date(job.applicationDeadline).toLocaleDateString()}
                  </div>
                  <span className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 sm:hidden">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobPage;
