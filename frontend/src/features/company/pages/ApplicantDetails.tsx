import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import companyAxios from "../../../utils/companyAxios";
import ScheduleInterviewModal from "../components/modal/ScheduleInterviewModal";

export enum ApplicationStatus {
  APPLIED = "applied",
  SHORTLISTED = "shortlisted",
  REJECTED = "rejected",

  INTERVIEW_SCHEDULED = "interview_scheduled",
  INTERVIEW_CANCELLED = "interview_cancelled",

  INTERVIEW_ACCEPTED_BY_USER = "interview_accepted_by_user",
  INTERVIEW_REJECTED_BY_USER = "interview_rejected_by_user",

  INTERVIEW_FAILED = "interview_failed",
  INTERVIEW_PASSED = "interview_passed",

  OFFERED = "offered",
  SELECTED = "selected",

  WITHDRAWN = "withdrawn",
}

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
  status: ApplicationStatus;
  appliedAt: string;
  user: UserDetails;
  job: JobDetails;
  rejectionReason?: string; // optional
}

export default function ApplicantDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("applicatoin", application);
  useEffect(() => {
    async function fetchApplication() {
      setLoading(true);
      setError(null);
      try {
        const res = await companyAxios.get(`/application/${applicationId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setApplication(res.data.application);
        } else {
          setError("Failed to load application");
        }
      } catch (err) {
        setError("Failed to load application");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchApplication();
  }, [applicationId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!application) return <div>No application found</div>;

  const { user, resumeUrl, status, appliedAt, job, rejectionReason } =
    application;

  // Handler for scheduling interview (replace with your modal / form logic)
  function handleScheduleInterview() {
    alert("Open scheduling UI here");
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* User Info */}
      <div className="flex items-center gap-4">
        <img
          src={
            user.profilePicture ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`
          }
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <Link to={`/in/${user.username}`}>
            <p className="text-gray-500">@{user.username}</p>
          </Link>
        </div>
      </div>

      {/* Job Info */}
      <div>
        <h3 className="text-lg font-medium">Job Title</h3>
        <p>{job.title}</p>
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

      <ScheduleInterviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        applicationId={application._id}
        userId={user._id}
        onInterviewScheduled={() => {
          // Optional: Refresh interview list or show success toast
          console.log("Interview Scheduled!");
        }}
      />

      {/* Status Based UI */}
      <div>
        {(() => {
          switch (status) {
            case ApplicationStatus.SHORTLISTED:
              return (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                >
                  Schedule Interview
                </button>
              );

            case ApplicationStatus.REJECTED:
            case ApplicationStatus.WITHDRAWN:
              return (
                <div className="mt-4 text-red-600">
                  {rejectionReason
                    ? `Reason: ${rejectionReason}`
                    : "Application was rejected."}
                </div>
              );

            case ApplicationStatus.INTERVIEW_SCHEDULED:
              return (
                <div className="mt-4 text-green-600">
                  Interview has been scheduled. Please check your email for
                  details.
                </div>
              );

            case ApplicationStatus.INTERVIEW_CANCELLED:
              return (
                <div className="mt-4 text-yellow-600">
                  Interview has been cancelled by the company.
                </div>
              );

            case ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER:
              return (
                <div className="mt-4 text-green-700">
                  Applicant has accepted the interview.
                </div>
              );

            case ApplicationStatus.INTERVIEW_REJECTED_BY_USER:
              return (
                <div className="mt-4 text-red-600">
                  Applicant rejected the interview invitation.
                </div>
              );

            case ApplicationStatus.INTERVIEW_FAILED:
              return (
                <div className="mt-4 text-red-700">
                  Interview was not successful.
                </div>
              );

            case ApplicationStatus.INTERVIEW_PASSED:
              return (
                <div className="mt-4 text-green-700">
                  Interview was successful.
                </div>
              );

            case ApplicationStatus.OFFERED:
              return (
                <div className="mt-4 text-blue-700">
                  Offer has been made to the applicant.
                </div>
              );

            case ApplicationStatus.SELECTED:
              return (
                <div className="mt-4 text-green-800">
                  Applicant has been selected for the job.
                </div>
              );

            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}
