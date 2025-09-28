import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import Spinner from "../components/Spinner";
import ConfirmSoftDeleteModal from "../../user/componets/modals/ConfirmSoftDeleteModal";
import BigModal from "../../user/componets/modals/BigModal";
import UpdateJobForm from "../components/Job/UpdateJobForm";

import { JobResponseDto, JobService } from "../services/jobServices";
import { handleApiError } from "../../../utils/apiError";
import LoadingIndicator from "../../admin/components/UserManagement/LoadingIndicator";

function JobDetailedPage() {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();

  const [job, setJob] = useState<JobResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (jobId) void fetchJob(jobId);
  }, [jobId, isEditModalOpen]);

  async function fetchJob(id: string) {
    setIsLoading(true);
    try {
      const jobData = await JobService.getJob(id); // ✅ jobData is JobResponseDto
      setJob(jobData);
      setError(null);
    } catch (err: unknown) {
      const parsed = handleApiError(err, "Failed to schedule interview");

      setError(parsed.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) {
      toast.error("Job ID not found");
      return;
    }

    try {
      await JobService.deleteJob(id); // throws on error
      toast.success("Job deleted successfully");
      navigate("/company/manage-jobs");
    } catch (err: unknown) {
      const parsed = handleApiError(err, "Failed to schedule interview");

      toast.error(parsed.message || "error occured in delete");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-2xl mx-auto mt-8">{error}</div>
    );
  }

  if (!job) return <div className="text-center mt-8">Job not found</div>;

  const {
    title,
    description,
    location,
    experienceLevel,
    salary,
    applicationDeadline,
    benefits,
    perks,
    skillsRequired,
  } = job;

  const deadlineDate = new Date(applicationDeadline);
  const isDeadlinePassed = new Date() > deadlineDate;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <div className="mt-2 flex items-center text-gray-600">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">{location}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={`/company/job/applicants/${jobId}`}>
                <button className="btn btn-primary gap-2">
                  <BriefcaseIcon className="h-5 w-5" />
                  View Candidates
                </button>
              </Link>

              <button
                className="btn btn-outline gap-2"
                onClick={() => setIsEditModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>

              <button
                className="btn btn-error gap-2"
                onClick={() => setShowDeleteModal(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* Delete Modal */}
          <ConfirmSoftDeleteModal
            isOpen={showDeleteModal}
            onConfirm={() => {
              setShowDeleteModal(false);
              void handleDelete(jobId!);
            }}
            onCancel={() => setShowDeleteModal(false)}
            itemType="job"
            itemName={title}
            extraMessage="Are you sure you want to delete this job?"
          />

          {/* Edit Modal */}
          <BigModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="Update Job"
          >
            {jobId && (
              <UpdateJobForm
                jobId={jobId}
                onSuccess={() => setIsEditModalOpen(false)}
              />
            )}
          </BigModal>

          {/* Job Content */}
          <div className="px-6 py-8">
            {/* Info Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    Salary
                  </h3>
                  <p className="text-lg font-medium text-gray-900">
                    {salary.isVisibleToApplicants ? (
                      `${salary.currency} ${salary.min} - ${salary.max} LPA`
                    ) : (
                      <span className="text-gray-500">Confidential</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    Experience
                  </h3>
                  <p className="text-lg font-medium text-gray-900 capitalize">
                    {experienceLevel}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <ClockIcon className="h-6 w-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">
                    Deadline
                  </h3>
                  <p
                    className={`text-lg font-medium ${
                      isDeadlinePassed ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {deadlineDate.toLocaleDateString()}
                    {isDeadlinePassed && (
                      <span className="ml-2 text-xs font-normal">
                        (Expired)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-700">
                {description.split("\n").map((para: string, idx: number) => (
                  <p key={idx} className="mb-4">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Skills, Benefits, Perks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skillsRequired?.length > 0 && (
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsRequired.map((skill: string, index: number) => (
                      <span key={index} className="badge badge-outline">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {benefits?.length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Benefits</h3>
                    <ul className="space-y-3">
                      {benefits.map((benefit: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-green-600 mr-2 mt-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {perks?.length > 0 && (
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Perks</h3>
                    <ul className="space-y-3">
                      {perks.map((perk: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-blue-600 mr-2 mt-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetailedPage;
