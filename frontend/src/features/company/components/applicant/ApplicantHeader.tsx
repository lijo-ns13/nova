import React from "react";
import { Applicant } from "../../types/applicant";
import { getStatusColor, getStatusIcon } from "../../util/statusUtilsApplicant";
import { SecureCloudinaryImage } from "../../../../components/SecureCloudinaryImage";

interface ApplicantHeaderProps {
  applicant: Applicant;
}

const ApplicantHeader: React.FC<ApplicantHeaderProps> = ({ applicant }) => {
  const StatusIcon = getStatusIcon(applicant.status);
  const statusColor = getStatusColor(applicant.status);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Profile Image */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
              {/* <img
                src={
                  applicant.user.profilePicture ||
                  "https://images.pexels.com/photos/2681751/pexels-photo-2681751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                }
                alt={applicant.user.name}
                className="w-full h-full object-cover"
              /> */}
              <SecureCloudinaryImage
                publicId={applicant.user.profilePicture}
                alt={applicant.user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center ${statusColor.bgLight}`}
            >
              <StatusIcon size={14} className={statusColor.text} />
            </div>
          </div>

          {/* Applicant Info */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                  {applicant.user.name}
                </h1>
                <div className="flex flex-wrap items-center mt-1 gap-x-2">
                  <span className="text-sm sm:text-base text-slate-500 truncate">
                    @{applicant.user.username}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="text-sm sm:text-base text-slate-500">
                    Applied on{" "}
                    {new Date(applicant.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full ${statusColor.bgLight} ${statusColor.text} font-medium text-xs sm:text-sm flex items-center mt-2 sm:mt-0 self-start sm:self-auto`}
              >
                <StatusIcon size={14} className="mr-1 sm:mr-1.5" />
                <span className="capitalize">
                  {applicant.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
              {applicant.scheduledAt && (
                <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mr-1 sm:mr-1.5 flex-shrink-0"
                  >
                    <rect
                      width="18"
                      height="18"
                      x="3"
                      y="4"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                  </svg>
                  <span className="truncate">
                    Interview:{" "}
                    {new Date(applicant.scheduledAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantHeader;
