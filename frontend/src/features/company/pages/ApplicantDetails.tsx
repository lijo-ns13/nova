import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplicantById } from "../services/newApplicantService";

interface Job {
  title: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salary: {
    min: number;
    max: number;
    currency: string;
    isVisibleToApplicants: boolean;
  };
}

interface User {
  name: string;
  username: string;
  profilePicture: string;
}

interface StatusHistoryItem {
  status: string;
  changedAt: string;
  reason?: string;
}

interface Applicant {
  job: Job;
  user: User;
  resumeUrl?: string;
  resumeMediaId?: string;
  status: string;
  appliedAt: string;
  statusHistory: StatusHistoryItem[];
  updatedAt?: string;
  createdAt?: string;
}

function ApplicantDetails() {
  const [loading, setLoading] = useState<boolean>(false);
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [error, setError] = useState<string>("");
  const { applicationId } = useParams();

  const fetchApplicantData = async () => {
    setLoading(true);
    try {
      if (!applicationId) return;

      const res = await getApplicantById(applicationId);
      if (res.success) {
        setApplicant(res.data);
      } else {
        setError("Failed to fetch applicant details.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicantData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!applicant) return <div className="p-4">No data available.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={applicant.user.profilePicture}
          alt={applicant.user.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{applicant.user.name}</h2>
          <p className="text-sm text-gray-600">@{applicant.user.username}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Applied for:</h3>
        <p className="text-gray-800">{applicant.job.title}</p>
        <p className="text-gray-500 text-sm">
          {applicant.job.location} | {applicant.job.jobType} |{" "}
          {applicant.job.experienceLevel}
        </p>
        {applicant.job.salary.isVisibleToApplicants && (
          <p className="text-sm mt-1">
            Salary: {applicant.job.salary.min} - {applicant.job.salary.max}{" "}
            {applicant.job.salary.currency}
          </p>
        )}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Application Status:</h3>
        <p className="capitalize font-medium text-green-600">
          {applicant.status}
        </p>
        <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
          {applicant.statusHistory.map((history, index) => (
            <li key={index}>
              {history.status} at {new Date(history.changedAt).toLocaleString()}
              {history.reason && ` (Reason: ${history.reason})`}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <a
          href={applicant.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          View Resume
        </a>
      </div>
    </div>
  );
}

export default ApplicantDetails;
