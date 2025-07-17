import { FC } from "react";
import { AppliedJobResponseDTO } from "../../services/JobServices";
import { formatDistanceToNow } from "date-fns";

interface ApplicationCardProps {
  appliedJob: AppliedJobResponseDTO;
  onStatusChange?: () => void;
}

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "rejected":
      return "bg-red-100 text-red-700";
    case "selected":
    case "hired":
      return "bg-green-100 text-green-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
};

const ApplicationCard: FC<ApplicationCardProps> = ({
  appliedJob,
  onStatusChange,
}) => {
  const { job, appliedAt, status, scheduledAt } = appliedJob;

  return (
    <div className="border rounded-2xl shadow-sm p-4 mb-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {/* Job Info */}
        <div>
          <h2 className="text-lg font-semibold">{job.title}</h2>
          <p className="text-sm text-gray-500 capitalize">{job.location}</p>
          <p className="text-sm text-gray-500">{job.jobType}</p>
        </div>

        {/* Application Info */}
        <div>
          <p className="text-sm">
            <span className="font-medium">Applied:</span>{" "}
            {formatDistanceToNow(new Date(appliedAt), { addSuffix: true })}
          </p>
          {scheduledAt && (
            <p className="text-sm">
              <span className="font-medium">Interview:</span>{" "}
              {new Date(scheduledAt).toLocaleString()}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col md:items-end gap-2">
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusStyles(
              status
            )}`}
          >
            {status.replace(/_/g, " ")}
          </span>

          {/* Optional Refresh Button */}
          {/* <button
            onClick={onStatusChange}
            className="text-sm px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100 transition"
          >
            Refresh Status
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
