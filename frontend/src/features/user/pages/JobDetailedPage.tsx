import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJob, getJobAppliedStatus } from "../services/JobServices";
import ApplyModal from "../componets/ApplyModal";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  GraduationCap,
  Globe,
  Check,
  Share2,
  Star,
  ArrowLeft,
  Building,
  Calendar,
  User,
} from "lucide-react";
import BaseModal from "../componets/modals/BaseModal";
import { useAppSelector } from "../../../hooks/useAppSelector";

export interface JobResponseDTO {
  id: string;
  title: string;
  description: string;
  location: string;
  jobType: string;
  employmentType: string;
  experienceLevel: string;
  skills: string[];
  applicationDeadline: string;
  status: string;
}

export interface GetJobResponseDTO extends JobResponseDTO {
  salary: {
    currency: string;
    min: number;
    max: number;
    isVisibleToApplicants: boolean;
  };
  benefits: string[];
  perks?: string[];
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    companyName: string;
    foundedYear: string;
    username: string;
  };
}

function JobDetailedPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<GetJobResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);

  const applyLimit = import.meta.env.VITE_FREE_JOB_APPLY_COUNT || 2;
  const { appliedJobCount, isSubscriptionActive } = useAppSelector(
    (state) => state.auth
  );
  const [showSubscriptionModal, setShowSubscriptionModal] =
    useState<boolean>(false);

  const fetch = async () => {
    if (jobId) {
      await fetchJobDetails(jobId);
      const res = await getJobAppliedStatus(jobId);
      setIsApplied(res.data);
    }
  };

  useEffect(() => {
    fetch();
  }, [jobId]);

  useEffect(() => {
    if (applicationSuccess) {
      setShowSuccessNotification(true);
      const timer = setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [applicationSuccess]);

  async function fetchJobDetails(id: string) {
    setLoading(true);
    try {
      const res = await getJob(id);
      setJob(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load job details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleApply = () => {
    if (
      isSubscriptionActive ||
      (appliedJobCount !== undefined && appliedJobCount < applyLimit)
    ) {
      setShowApplyModal(true);
      setApplicationSuccess(false);
    } else {
      setShowSubscriptionModal(true);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: job?.title || "Job Opportunity",
      text: `Check out this job: ${job?.title} at ${job?.company?.companyName}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.log("Clipboard write failed:", err);
      }
    }
  };

  const formatSalary = () => {
    if (!job?.salary || !job.salary.isVisibleToApplicants) {
      return "Competitive Salary";
    }

    const currencySymbol = "₹"; // Since it's Indian Rupees
    const minLPA = job.salary.min;
    const maxLPA = job.salary.max;

    return `${currencySymbol}${minLPA} LPA - ${currencySymbol}${maxLPA} LPA`;
  };

  const getApplyBtnClass = () => {
    const baseClass =
      "w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2";

    if (job?.status !== "open") {
      return `${baseClass} bg-gray-300 text-gray-600 cursor-not-allowed`;
    }
    if (isApplied) {
      return `${baseClass} bg-green-100 text-green-800 cursor-default`;
    }
    return `${baseClass} bg-black text-white hover:bg-gray-800`;
  };

  const getDaysRemaining = () => {
    if (!job?.applicationDeadline) return null;

    const deadline = new Date(job.applicationDeadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Deadline passed";
    if (diffDays === 1) return "1 day left";
    return `${diffDays} days left`;
  };

  const getExperienceLevelLabel = (level: string) => {
    switch (level?.toLowerCase()) {
      case "entry":
        return "Entry Level (0-2 years)";
      case "mid":
        return "Mid Level (2-5 years)";
      case "senior":
        return "Senior Level (5+ years)";
      default:
        return level || "Not Specified";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md mx-4 p-6 bg-white rounded-lg border border-gray-200 text-center">
          <div className="text-xl font-semibold mb-2 text-gray-800">
            Error Loading Job
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchJobDetails(jobId || "")}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md mx-4 p-6 text-center">
          <div className="text-6xl mb-4 text-gray-300">404</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The job posting you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            to="/jobs"
            className="inline-flex items-center text-black hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Browse all jobs</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Success notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center animate-fade-in">
          <Check className="h-5 w-5 mr-2" />
          <span>Application submitted successfully!</span>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <Link
            to="/jobs"
            className="inline-flex items-center text-black hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back to Jobs</span>
          </Link>
        </div>

        {/* Job header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === "open"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {job.status === "open" ? "Actively Hiring" : "Closed"}
                </span>
                <span className="text-gray-500 text-sm">
                  Posted {formatDate(job.createdAt)}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {job.title}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <Link
                  to={`/company/${job.company.username}`}
                  className="font-medium text-gray-800 hover:text-black transition-colors"
                >
                  {job.company.companyName}
                </Link>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-1.5 text-gray-500" />
                  <span>{job.location || "Remote"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-5 w-5 mr-1.5 text-gray-500" />
                  <span className="capitalize">
                    {job.employmentType.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span>{formatSalary()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label="Share job"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Deadline Banner */}
          {job.applicationDeadline && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-2 sm:mb-0">
                <Clock className="h-5 w-5 text-amber-600 mr-2" />
                <div>
                  <span className="text-amber-800 font-medium">
                    Application Deadline:{" "}
                  </span>
                  <span className="text-amber-700">
                    {formatDate(job.applicationDeadline)}
                  </span>
                </div>
              </div>
              <div className="text-sm font-medium text-amber-700">
                {getDaysRemaining()}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Job Description
              </h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {job.description || "No description provided."}
              </div>
            </div>

            {/* Skills Required */}
            {job.skills?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                  Skills Required
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits & Perks */}
            {(job.benefits?.length > 0 || job.perks?.length > 0) && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                  Benefits & Perks
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {job.benefits?.map((benefit, index) => (
                    <div
                      key={`benefit-${index}`}
                      className="flex items-start p-3 bg-gray-50 rounded-lg"
                    >
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                  {job.perks?.map((perk, index) => (
                    <div
                      key={`perk-${index}`}
                      className="flex items-start p-3 bg-gray-50 rounded-lg"
                    >
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                About the Company
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {job.company.companyName}
                    </h3>
                    {/* <Link
                      to={`/company/${job.company.username}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View company profile
                    </Link> */}
                  </div>
                </div>
                {job.company.foundedYear && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>Founded in {job.company.foundedYear}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-gray-700">
                  <User className="h-5 w-5 text-gray-500" />
                  <span>@{job.company.username}</span>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Job Details
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Experience Level
                  </h3>
                  <p className="text-gray-900">
                    {getExperienceLevelLabel(job.experienceLevel)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Job Type
                  </h3>
                  <p className="text-gray-900 capitalize">
                    {job.jobType?.replace("-", " ") || "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Employment Type
                  </h3>
                  <p className="text-gray-900 capitalize">
                    {job.employmentType?.replace("-", " ") || "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Posted</h3>
                  <p className="text-gray-900">{formatDate(job.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Last Updated
                  </h3>
                  <p className="text-gray-900">{formatDate(job.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Apply Section */}
            <div className="sticky top-6 bg-white rounded-xl border border-gray-200 p-6">
              {isApplied ? (
                <button className={getApplyBtnClass()} disabled>
                  <Check className="h-5 w-5" />
                  <span>Application Submitted</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleApply}
                    disabled={job.status !== "open"}
                    className={getApplyBtnClass()}
                  >
                    {job.status === "open"
                      ? "Apply Now"
                      : "Applications Closed"}
                  </button>
                  {!isSubscriptionActive && job.status === "open" && (
                    <p className="text-center text-sm text-gray-500">
                      {appliedJobCount !== undefined ? (
                        <>
                          {applyLimit - appliedJobCount} free{" "}
                          {applyLimit - appliedJobCount === 1
                            ? "application"
                            : "applications"}{" "}
                          remaining
                        </>
                      ) : (
                        "Loading application limit..."
                      )}
                    </p>
                  )}
                </div>
              )}

              {job.status === "open" && !isApplied && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  Easy application process, takes only a few minutes
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          jobId={job.id}
          onClose={() => setShowApplyModal(false)}
          onApplySuccess={() => {
            setApplicationSuccess(true);
            setShowApplyModal(false);
            fetch(); // Refresh application status
          }}
        />
      )}

      {/* Subscription Modal */}
      <BaseModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        title="Upgrade Required"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            You've used all {applyLimit} free job applications. Upgrade to our
            premium plan to continue applying for jobs.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <Link
              to="/subscription"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-center"
              onClick={() => setShowSubscriptionModal(false)}
            >
              View Plans
            </Link>
          </div>
        </div>
      </BaseModal>
    </div>
  );
}

export default JobDetailedPage;
