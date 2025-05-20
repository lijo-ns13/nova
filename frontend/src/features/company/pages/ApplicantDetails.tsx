import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import companyAxios from "../../../utils/companyAxios";

interface UserDetails {
  _id: string;
  name: string;
  username: string;
  profilePicture: string | null;
}

interface JobDetails {
  _id: string;
  title: string;
}

interface Application {
  _id: string;
  resumeUrl: string;
  status: string;
  appliedAt: string;
  userDetails: UserDetails;
  jobDetails: JobDetails;
}

export default function ApplicationDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplication() {
      try {
        const res = await companyAxios.get(`/applicant/${applicationId}`, {
          withCredentials: true,
        });
        const data = await res.data;
        if (data) {
          setApplication(data.application);
        }
      } catch (err) {
        console.error("Failed to fetch application", err);
      } finally {
        setLoading(false);
      }
    }

    fetchApplication();
  }, [applicationId]);

  if (loading || !application) return <div>Loading...</div>;

  const { userDetails, resumeUrl, status, appliedAt } = application;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* User Info */}
      <div className="flex items-center gap-4">
        <img
          src={
            userDetails.profilePicture ??
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(userDetails.name)
          }
          alt={userDetails.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{userDetails.name}</h2>
          <p className="text-gray-500">@{userDetails.username}</p>
        </div>
      </div>

      {/* Resume Link */}
      <div>
        <h3 className="text-lg font-medium">Resume</h3>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View Resume
        </a>
      </div>

      {/* Application Status */}
      <div>
        <h3 className="text-lg font-medium">Status</h3>
        <p className="capitalize text-green-700">{status.replace("_", " ")}</p>
        <p className="text-sm text-gray-500 mt-1">
          Applied on {new Date(appliedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
