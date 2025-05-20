import React, { useState } from "react";
import DetailCard from "./DetailCard";

interface ResumeCardProps {
  resumeUrl: string;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resumeUrl }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fileExtension = resumeUrl.split(".").pop()?.toLowerCase();
  const isPdf = fileExtension === "pdf";

  return (
    <DetailCard title="Resume">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex-1 w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-gray-700 truncate">
                {resumeUrl.split("/").pop() || "Resume"}
              </p>
              <p className="text-xs text-gray-500">
                {fileExtension?.toUpperCase() || "File"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm font-medium flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Download</span>
          </a>

          {isPdf && (
            <button
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              className="flex-1 sm:flex-initial px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 text-sm font-medium flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{isPreviewOpen ? "Hide Preview" : "Preview"}</span>
            </button>
          )}
        </div>
      </div>

      {isPreviewOpen && isPdf && (
        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <iframe
            src={`${resumeUrl}#toolbar=0`}
            className="w-full h-96"
            title="Resume Preview"
          ></iframe>
        </div>
      )}
    </DetailCard>
  );
};

export default ResumeCard;
