import { useState, useRef } from "react";
import {
  DocumentTextIcon,
  PaperClipIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { applyJob } from "../services/JobServices";

interface ApplyModalProps {
  jobId: string;
  onClose: () => void;
  onApplySuccess: () => void;
}

export default function ApplyModal({
  jobId,
  onClose,
  onApplySuccess,
}: ApplyModalProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setResumeFile(file);
    setError("");
  };

  const removeFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resumeFile) {
      setError("Please upload your resume");
      return;
    }

    setIsSubmitting(true);
    try {
      await applyJob({
        jobId,
        resumeFile,
        coverLetter,
      });
      onApplySuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
      console.error("Application error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Apply for this position</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume (PDF only)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="resume-upload"
                  className="flex-1 cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-md border border-gray-300 flex items-center justify-center gap-2"
                >
                  <PaperClipIcon className="h-5 w-5" />
                  <span>Choose file</span>
                </label>
              </div>
              {resumeFile && (
                <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-sm truncate">{resumeFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                PDF files only (max 5MB)
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="coverLetter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cover Letter (Optional)
              </label>
              <textarea
                id="coverLetter"
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Explain why you're a good fit for this position..."
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={!resumeFile || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Applying...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
