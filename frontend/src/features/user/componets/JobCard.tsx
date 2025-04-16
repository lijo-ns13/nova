import React from "react";
import { Link } from "react-router-dom";
import { BookmarkIcon, ClockIcon } from "@heroicons/react/24/outline";

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    company: string;
    description: string;
    location: string;
    createdAt?: Date;
    appliedAt?: Date;
    status?: string;
  };
  showSaveButton?: boolean;
  isSaved?: boolean;
  onSaveToggle?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  showSaveButton = true,
  isSaved = false,
  onSaveToggle,
}) => {
  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSaveToggle?.();
  };

  // Format date based on available fields
  const displayDate = job.appliedAt
    ? `Applied: ${new Date(job.appliedAt).toLocaleDateString()}`
    : job.createdAt
    ? `Posted: ${new Date(job.createdAt).toLocaleDateString()}`
    : "";

  return (
    <Link to={`/jobs/${job._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
          {showSaveButton && (
            <button
              onClick={handleSaveToggle}
              className={`p-2 rounded-full ${
                isSaved
                  ? "text-yellow-500 hover:text-yellow-600"
                  : "text-gray-400 hover:text-gray-500"
              }`}
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              <BookmarkIcon
                className={`h-6 w-6 ${isSaved ? "fill-current" : ""}`}
              />
            </button>
          )}
        </div>

        <div className="mb-4">
          <p className="text-gray-700 font-medium">{job.company}</p>
        </div>

        <div className="space-y-3">
          <p className="text-gray-600 line-clamp-2">
            {job.description.replace(/[⿡\n]/g, " ")}
          </p>

          <div className="flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

          {displayDate && (
            <div className="flex items-center text-gray-500 text-sm">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>{displayDate}</span>
            </div>
          )}

          {job.status && (
            <div className="mt-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  job.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : job.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
