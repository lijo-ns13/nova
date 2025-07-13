import React, { useEffect, useState } from "react";
import { Briefcase, MapPin, Clock, Building, DollarSign } from "lucide-react";
import { JobResponseDTO } from "../../services/JobServices";
import { getJobAppliedStatus } from "../../services/JobServices";

interface JobCardProps {
  job: JobResponseDTO;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [isApplied, setIsApplied] = useState<boolean>(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await getJobAppliedStatus(job.id);
        setIsApplied(res.data); // `data` is boolean in APIResponse<boolean>
      } catch (err) {
        console.error("Failed to fetch application status", err);
      }
    };

    fetchStatus();
  }, [job.id]);

  // const formatSalary = (salary: JobResponseDTO["salary"]) => {
  //   if (!salary.isVisibleToApplicants) return "Salary not disclosed";
  //   return `${
  //     salary.currency
  //   } ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  // };

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

  const getBadgeClass = (
    value: string,
    type: "experience" | "jobType" | "employment"
  ) => {
    const map: Record<string, string> = {
      // Experience
      entry: "bg-green-100 text-green-800",
      mid: "bg-blue-100 text-blue-800",
      senior: "bg-purple-100 text-purple-800",
      lead: "bg-orange-100 text-orange-800",

      // Job Type
      remote: "bg-teal-100 text-teal-800",
      onsite: "bg-amber-100 text-amber-800",
      hybrid: "bg-indigo-100 text-indigo-800",

      // Employment Type
      "full-time": "bg-blue-100 text-blue-800",
      "part-time": "bg-purple-100 text-purple-800",
      contract: "bg-yellow-100 text-yellow-800",
      internship: "bg-green-100 text-green-800",
    };

    return map[value] || "bg-gray-100 text-gray-800";
  };

  return (
    <a
      href={`/jobs/${job.id}`}
      className="block bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div className="sm:flex sm:items-start">
            <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center mr-4 hidden sm:flex">
              <Building className="h-6 w-6 text-gray-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {job.title}
              </h2>
              {/* <p className="text-gray-600 mb-2">{job.company.companyName}</p> */}

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

                {/* <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>{formatSalary(job.salary)}</span>
                </div> */}

                {/* <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{getRelativeTime(job.createdAt)}</span>
                </div> */}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeClass(
                    job.jobType,
                    "jobType"
                  )}`}
                >
                  {job.jobType}
                </span>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeClass(
                    job.employmentType,
                    "employment"
                  )}`}
                >
                  {job.employmentType.replace("-", " ")}
                </span>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeClass(
                    job.experienceLevel,
                    "experience"
                  )}`}
                >
                  {job.experienceLevel} level
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-0 hidden sm:flex gap-2 items-center">
            {isApplied && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-300">
                ✅ Applied
              </span>
            )}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100">
              View Details
            </span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-gray-600 line-clamp-2">{job.description}</p>
        </div>

        {job.skills.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {skill}
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
