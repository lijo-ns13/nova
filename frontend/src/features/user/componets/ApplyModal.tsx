import { useState, useRef } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { uploadToCloudinary } from "../../company/services/cloudinaryService";
import { applyJob } from "../services/JobServices";
import { CheckIcon } from "@heroicons/react/24/outline";

interface ApplyModalProps {
  jobId: string;
  onClose: () => void;
  onApplySuccess: () => void;
}

function ApplyModal({ jobId, onClose, onApplySuccess }: ApplyModalProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [error, setError] = useState("");
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is PDF or image
    if (!file.type.match("application/pdf")) {
      // For images, show crop UI
      const reader = new FileReader();
      reader.onload = () => {
        setSrcImage(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    } else {
      // For PDFs, upload directly
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File | Blob) => {
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      console.log("url", url);
      setResumeUrl(url);
      setError("");
    } catch (err) {
      setError("Failed to upload resume. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleCropComplete = () => {
    if (!imageRef.current || !crop.width || !crop.height) return;

    const canvas = document.createElement("canvas");
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        await handleUpload(blob);
        setIsCropping(false);
        setSrcImage(null);
      },
      "image/jpeg",
      0.9
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeUrl) {
      setError("Please upload your resume");
      return;
    }

    try {
      await applyJob(jobId, resumeUrl);
      onApplySuccess();
    } catch (err: any) {
      setError(
        err.response.data.message ||
          "Failed to submit application. Please try again."
      );
      console.log("eror", err);
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
              aria-label="Close modal"
            >
              <svg
                className="h-6 w-6"
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
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Resume (PDF or Image)
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleImageSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={uploading}
              />
            </div>

            {isCropping && srcImage && (
              <div className="mb-4">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={handleCropComplete}
                >
                  <img
                    ref={imageRef}
                    src={srcImage}
                    alt="Resume preview"
                    className="max-w-full max-h-64 object-contain"
                  />
                </ReactCrop>
                <button
                  type="button"
                  onClick={handleCropComplete}
                  className="mt-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  disabled={uploading}
                >
                  Crop and Save
                </button>
              </div>
            )}

            {uploading && (
              <div className="mb-4 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                <span>Uploading resume...</span>
              </div>
            )}

            {resumeUrl && !uploading && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                <div className="flex items-center">
                  <CheckIcon className="h-5 w-5 mr-2" />
                  <span>Resume uploaded successfully</span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!resumeUrl || uploading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplyModal;
