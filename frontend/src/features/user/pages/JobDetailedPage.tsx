import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getJob,
  saveJob,
  unsaveJob,
  getJobAppliedStatus,
} from "../services/JobServices";
import ApplyModal from "../componets/ApplyModal";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  GraduationCap,
  Globe,
  Check,
  Building2,
  Share2,
  Bookmark,
  Users,
  Star,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

// Define TypeScript interfaces for better type safety
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
  jobPosted?: any[];
  isVerified: boolean;
  isBlocked: boolean;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Job {
  _id: string;
  id?: string;
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
  __v: number;
}

function JobDetailedPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [isApplied, setIsApplied] = useState<boolean>(false);
  const fetch = async () => {
    if (jobId) {
      await fetchJobDetails(jobId);
      const res = await getJobAppliedStatus(jobId);
      console.log("status", res.data.hasApplied);
      setIsApplied(res.data.hasApplied);
    }
  };
  useEffect(() => {
    fetch();
  }, [jobId]);

  // Show success notification for 5 seconds
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
      // Access the first element of the array if response is an array
      const jobData = Array.isArray(res) ? res[0] : res;
      setJob(jobData);
      setError("");
    } catch (err) {
      setError("Failed to load job details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleApply = () => {
    setShowApplyModal(true);
    setApplicationSuccess(false);
  };

  const handleBookmark = async (jobId: string) => {
    try {
      const action = bookmarked ? unsaveJob : saveJob;
      await action(jobId);

      setBookmarked(!bookmarked);

      // Notification
      const message = bookmarked
        ? "❌ Removed from saved jobs"
        : "🔖 Saved to your bookmarks";

      const notification = document.createElement("div");
      notification.className =
        "fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-up transition-all duration-500";
      notification.textContent = message;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add("opacity-0", "translate-y-4");
        setTimeout(() => document.body.removeChild(notification), 500);
      }, 2000);
    } catch (error) {
      console.error("Bookmarking failed", error);
      alert("Failed to save job. Please try again.");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: job?.title || "Job Opportunity",
          text: `Check out this job: ${job?.title} at ${job?.company?.companyName}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const formatSalary = () => {
    if (!job?.salary) return "Competitive Salary";

    if (job.salary.isVisibleToApplicants) {
      return `${
        job.salary.currency || "USD"
      } ${job.salary.min.toLocaleString()}${
        job.salary.min >= 100000 ? "" : "K"
      } - ${job.salary.max.toLocaleString()}${
        job.salary.max >= 100000 ? "" : "K"
      } /year`;
    }
    return "Competitive Salary";
  };

  const getApplyBtnClass = () => {
    return job?.status === "open"
      ? "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      : "w-full bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed";
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
        return "Entry Level";
      case "mid":
        return "Mid Level";
      case "senior":
        return "Senior Level";
      case "lead":
        return "Lead Level";
      default:
        return level || "Not Specified";
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 animate-pulse">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-8 rounded-lg text-center max-w-2xl mx-auto my-8">
        <div className="text-xl font-semibold mb-2">Error Loading Job</div>
        <p>{error}</p>
        <button
          onClick={() => fetchJobDetails(jobId || "")}
          className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-16 max-w-2xl mx-auto">
        <div className="text-gray-400 text-6xl mb-4">404</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Job Not Found</h2>
        <p className="text-gray-500">
          The job posting you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 bg-gray-50 min-h-screen">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to Jobs</span>
        </button>
      </div>

      {/* Success notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md z-50 animate-fade-in">
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2 text-green-600" />
            <span>Application submitted successfully!</span>
          </div>
        </div>
      )}

      {/* Header with actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 mb-6 transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  job.status === "open"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {job.status === "open" ? "Actively Hiring" : "Closed"}
              </span>
              <span className="text-gray-500 text-xs">
                Posted{" "}
                {new Date(job.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {job.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-medium text-gray-800">
                {job.company?.companyName || "Company Name"}
              </span>
              {job.company?.isVerified && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                  <Check className="h-3 w-3 mr-1" /> Verified
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 md:justify-end">
            <button
              onClick={() => handleBookmark(job._id)}
              className={`p-2 rounded-full ${
                bookmarked
                  ? "bg-blue-50 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              } hover:bg-gray-200 transition-colors`}
              aria-label="Bookmark job"
            >
              <Bookmark
                className="h-5 w-5"
                fill={bookmarked ? "currentColor" : "none"}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Share job"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center text-gray-500 mb-1">
              <Briefcase className="h-4 w-4 mr-1" />
              <span className="text-xs">Type</span>
            </div>
            <div className="font-medium capitalize text-sm md:text-base">
              {job.employmentType?.replace("-", " ") || "Not Specified"}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center text-gray-500 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-xs">Location</span>
            </div>
            <div className="font-medium text-sm md:text-base">
              {job.location || "Not Specified"}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center text-gray-500 mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="text-xs">Salary</span>
            </div>
            <div className="font-medium text-sm md:text-base">
              {formatSalary()}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center text-gray-500 mb-1">
              <GraduationCap className="h-4 w-4 mr-1" />
              <span className="text-xs">Experience</span>
            </div>
            <div className="font-medium capitalize text-sm md:text-base">
              {getExperienceLevelLabel(job.experienceLevel)}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center text-gray-500 mb-1">
              <Globe className="h-4 w-4 mr-1" />
              <span className="text-xs">Work Mode</span>
            </div>
            <div className="font-medium capitalize text-sm md:text-base">
              {job.jobType || "Not Specified"}
            </div>
          </div>
        </div>

        {/* Deadline Banner */}
        {job.applicationDeadline && (
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 md:p-4 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
              <div>
                <span className="text-amber-800 font-medium">
                  Application Deadline:{" "}
                </span>
                <span className="text-amber-700">
                  {new Date(job.applicationDeadline).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>
            <div className="text-sm font-medium text-amber-600 mt-2 sm:mt-0 sm:ml-4">
              {getDaysRemaining()}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Job Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 transition-all hover:shadow-md">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center">
              <span className="bg-blue-100 p-1.5 rounded-lg mr-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </span>
              Job Description
            </h2>
            <div className="space-y-4 text-gray-700 prose prose-blue max-w-none whitespace-pre-line">
              {job.description || "No description provided."}
            </div>
          </div>

          {/* Skills Required */}
          {job.skillsRequired?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 transition-all hover:shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-purple-100 p-1.5 rounded-lg mr-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </span>
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill: Skill) => (
                  <span
                    key={skill._id}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-sm font-medium flex items-center"
                  >
                    {skill.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits & Perks */}
          {(job.benefits?.length > 0 || job.perks?.length > 0) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 transition-all hover:shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="bg-green-100 p-1.5 rounded-lg mr-2">
                  <Star className="h-5 w-5 text-green-600" />
                </span>
                Benefits & Perks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {job.benefits?.map((benefit: string, index: number) => (
                  <div
                    key={`benefit-${index}`}
                    className="flex items-center bg-green-50 p-3 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-800">{benefit}</span>
                  </div>
                ))}
                {job.perks?.map((perk: string, index: number) => (
                  <div
                    key={`perk-${index}`}
                    className="flex items-center bg-green-50 p-3 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                    <span className="text-gray-800">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Apply section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 sticky top-6 transition-all hover:shadow-md">
            {isApplied ? (
              <button
                className="w-full bg-green-100 text-green-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-default"
                disabled
              >
                <Check className="h-5 w-5" />
                Already Applied
              </button>
            ) : (
              <button
                onClick={handleApply}
                disabled={job.status !== "open"}
                className={getApplyBtnClass()}
              >
                {job.status === "open" ? "Apply Now" : "Applications Closed"}
              </button>
            )}

            {job.status === "open" && !isApplied && (
              <p className="text-center text-sm text-gray-500 mt-2">
                Easy application process, takes only a few minutes
              </p>
            )}

            <div className="my-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-gray-600" />
                About the Company
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mr-3">
                    {job.company?.companyName?.charAt(0) || "C"}
                  </div>
                  <div>
                    <p className="font-medium">
                      {job.company?.companyName || "Company Name"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {job.company?.industryType || "Industry"}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm border-l-4 border-gray-200 pl-3">
                  {job.company?.about || "No company description available."}
                </p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Est. {job.company?.foundedYear || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{job.company?.location || "Location N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>50-200 employees</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      Company website
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Job ID:{" "}
                <span className="font-normal text-gray-500">
                  {job._id.slice(0, 8)}...
                </span>
              </h3>
              <div className="text-xs text-gray-500">
                <p>Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                <p>
                  Last updated on {new Date(job.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Jobs */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Similar Jobs</h2>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Just placeholder cards for similar jobs */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Similar {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Another Company</p>
                </div>
                <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  Remote
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  Full-time
                </span>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm text-gray-500">Posted 2 days ago</span>
                <span className="text-sm font-medium text-blue-600">
                  $80K-$100K
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyModal
          jobId={job._id}
          onClose={() => setShowApplyModal(false)}
          onApplySuccess={() => {
            setApplicationSuccess(true);
            setShowApplyModal(false);
          }}
        />
      )}
      {applicationSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md z-50 animate-fade-in">
          <div className="flex items-center">
            <Check className="h-5 w-5 mr-2 text-green-600" />
            <span>Application submitted successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetailedPage;
