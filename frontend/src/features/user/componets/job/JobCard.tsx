import React from "react";
import { Briefcase, MapPin, Clock, Building, DollarSign } from "lucide-react";
import { Job } from "../../types/jobTypes";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  // Format salary range
  const formatSalary = (salary: Job["salary"]) => {
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

  return (
    <a
      href={`/jobs/${job._id}`}
      className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
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
              <p className="text-gray-600 mb-2">{job.company.companyName}</p>

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
          <p className="text-gray-600 line-clamp-2">{job.description}</p>
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
    </a>
  );
};

export default JobCard;
