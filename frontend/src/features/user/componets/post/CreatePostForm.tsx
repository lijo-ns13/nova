import React, { useState, useRef, type ChangeEvent } from "react";
import { X, Upload, Image, Video, File, Send, Camera } from "lucide-react";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

interface Media {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video" | "file";
}

interface PostData {
  description: string;
  media: Media[];
}

interface CreatePostFormProps {
  onSubmit?: (data: PostData) => void;
  onClose?: () => void;
  userProfilePic?: string;
  userName?: string;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  onSubmit,
  onClose,
  userProfilePic,
  userName = "You",
}) => {
  const [step, setStep] = useState<"media" | "description">("media");
  const [media, setMedia] = useState<Media[]>([]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [dragInvalidType, setDragInvalidType] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addMediaFiles(Array.from(e.target.files));
    }
  };

  // Determine file type
  const getFileType = (file: File): "image" | "video" | "file" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "file";
  };

  // Process and add media files
  const addMediaFiles = (files: File[]) => {
    // Filter out unsupported files
    const validFiles = files.filter((file) => {
      const type = getFileType(file);
      return (
        type === "image" || type === "video" || file.type === "application/pdf"
      );
    });

    // Alert user about invalid files
    if (validFiles.length < files.length) {
      alert(
        "Only images, videos, and PDFs are allowed. Other file types were ignored."
      );
    }

    // Create media entries only for valid files
    const newMedia = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      type: getFileType(file),
    }));

    setMedia((prev) => [...prev, ...newMedia]);
  };

  // Remove a media item
  const removeMedia = (id: string) => {
    setMedia((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      return filtered;
    });
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if all files are valid types
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const allValid = Array.from(e.dataTransfer.items).every((item) => {
        const type = item.type;
        return (
          type.startsWith("image/") ||
          type.startsWith("video/") ||
          type === "application/pdf"
        );
      });

      setDragInvalidType(!allValid);
    }

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setDragInvalidType(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addMediaFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Go to next step
  const goToDescription = () => {
    setStep("description");
  };

  // Go back to media step
  const goBackToMedia = () => {
    setStep("media");
  };

  // Submit the post
  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Create form data for backend submission
      const formData = new FormData();
      formData.append("description", description);

      media.forEach((item) => {
        formData.append(`media`, item.file);
      });

      // Call the onSubmit callback with the post data
      if (onSubmit) {
        onSubmit({
          description,
          media,
        });
      }

      // Reset form and close modal
      setMedia([]);
      setDescription("");
      setStep("media");
      if (onClose) onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle error (show error message, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header with step indicator */}
      <div className="mb-6 flex items-center justify-between border-b dark:border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {step === "media" ? "Create New Post" : "Add Details"}
        </h2>
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${
              step === "media"
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            1
          </div>
          <div
            className={`h-0.5 w-4 ${
              step === "description"
                ? "bg-indigo-500"
                : "bg-gray-300 dark:bg-gray-700"
            }`}
          ></div>
          <div
            className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${
              step === "description"
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300"
                : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            2
          </div>
        </div>
      </div>

      {/* Media upload step */}
      {step === "media" && (
        <div className="space-y-4">
          {/* User info */}
          <div className="flex items-center mb-4">
            <Avatar src={userProfilePic} alt={userName} size="md" />
            <div className="ml-3">
              <p className="font-medium text-gray-900 dark:text-white">
                {userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Creating a post
              </p>
            </div>
          </div>

          {/* Media preview */}
          {media.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selected media ({media.length})
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mt-2">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : item.type === "video" ? (
                      <video
                        src={item.preview}
                        className="h-full w-full object-cover"
                        controls
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
                        <File className="h-10 w-10 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 text-center truncate max-w-full">
                          {item.file.name}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => removeMedia(item.id)}
                      className="absolute right-1 top-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drag and drop area */}
          <div
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all ${
              dragActive
                ? dragInvalidType
                  ? "border-red-400 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
                  : "border-indigo-400 bg-indigo-50 dark:border-indigo-700 dark:bg-indigo-900/20"
                : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800"
            } ${media.length > 0 ? "py-6" : "py-10"}`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,video/*,application/pdf"
              className="hidden"
            />

            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${
                dragInvalidType
                  ? "bg-red-100 text-red-500 dark:bg-red-900/50 dark:text-red-400"
                  : "bg-indigo-100 text-indigo-500 dark:bg-indigo-900/50 dark:text-indigo-400"
              } mb-3`}
            >
              {dragInvalidType ? <X size={24} /> : <Upload size={24} />}
            </div>

            <p className="mb-1 text-base font-medium text-gray-900 dark:text-white">
              {dragInvalidType
                ? "Unsupported file type!"
                : dragActive
                ? "Drop files to upload"
                : "Add photos or videos"}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-3">
              {dragInvalidType
                ? "Only images, videos, and PDFs are supported"
                : "Share your moments with photos and videos. Drag and drop files or click to browse."}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                <Image size={12} />
                Images
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                <Video size={12} />
                Videos
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                <File size={12} />
                PDFs
              </span>
            </div>
          </div>

          {/* Next button */}
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={goToDescription}
              disabled={media.length === 0}
              className={`${
                media.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Description step */}
      {step === "description" && (
        <div className="space-y-4">
          {/* Media preview (small) */}
          {media.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selected media
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {media.map((item) => (
                  <div
                    key={item.id}
                    className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : item.type === "video" ? (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <Video className="h-6 w-6 text-gray-400" />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <File className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <button
                      onClick={() => removeMedia(item.id)}
                      className="absolute right-0.5 top-0.5 bg-black/60 text-white rounded-full p-0.5 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={goBackToMedia}
                  className="flex h-16 w-16 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Camera className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>
          )}

          {/* Description textarea */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              What's on your mind?
            </label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share your thoughts, experiences, or ask a question..."
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-gray-800 dark:text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:outline-none transition-all"
            />
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex justify-between">
            <Button variant="outlined" onClick={goBackToMedia}>
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              disabled={!description.trim()}
              icon={!isSubmitting ? <Send size={16} /> : undefined}
            >
              {isSubmitting ? "Posting..." : "Create Post"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostForm;
