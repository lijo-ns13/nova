import React, { useState } from "react";
import DetailCard from "./DetailCard";

interface ResumeCardProps {
  resumeUrl: string;
}

const ResumeCard: React.FC<ResumeCardProps> = ({ resumeUrl }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fileExtension = resumeUrl.split(".").pop()?.toLowerCase();
  const isPdf = fileExtension === "pdf";
  const fileName = resumeUrl.split("/").pop() || "Resume";

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <DetailCard title="Resume">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* File info card */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex-1 w-full min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-blue-100 rounded-md flex-shrink-0">
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
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {fileName}
              </p>
              <p className="text-xs text-gray-500">{"resume"}</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <a
            href={resumeUrl}
            download={fileName}
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
            <>
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
                <span>{isPreviewOpen ? "Hide" : "Preview"}</span>
              </button>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-sm font-medium flex items-center justify-center gap-2"
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span>Open in New Tab</span>
              </a>
            </>
          )}
        </div>
      </div>

      {/* PDF Preview */}
      {isPreviewOpen && isPdf && (
        <div
          className={`mt-4 border border-gray-200 rounded-lg overflow-hidden bg-gray-100 ${
            isFullscreen ? "fixed inset-0 z-50 m-0 bg-white" : "relative h-96"
          }`}
        >
          <div
            className={`absolute top-2 right-2 z-10 flex gap-2 ${
              isFullscreen ? "bg-white p-2 rounded-md shadow-md" : ""
            }`}
          >
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
              )}
            </button>
            {isFullscreen && (
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                title="Close preview"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <iframe
            src={`${resumeUrl}#toolbar=0&navpanes=0`}
            className={`w-full ${
              isFullscreen ? "h-[calc(100vh-4rem)]" : "h-96"
            }`}
            title="Resume Preview"
          ></iframe>
        </div>
      )}
    </DetailCard>
  );
};

export default ResumeCard;
