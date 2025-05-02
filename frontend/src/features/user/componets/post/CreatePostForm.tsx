import axios from "axios";
import type React from "react";
import { useState, useRef, type ChangeEvent } from "react";

interface Media {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

interface PostData {
  description: string;
  media: Media[];
}

interface CreatePostFormProps {
  onSubmit?: (data: PostData) => void;
  onClose?: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  onSubmit,
  onClose,
}) => {
  const [step, setStep] = useState<"media" | "description">("media");
  const [media, setMedia] = useState<Media[]>([]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addMediaFiles(Array.from(e.target.files));
    }
  };

  // Process and add media files
  const addMediaFiles = (files: File[]) => {
    // Filter out non-image/video files
    const validFiles = files.filter((file) => {
      return file.type.startsWith("image/") || file.type.startsWith("video/");
    });

    // Alert user about invalid files
    if (validFiles.length < files.length) {
      alert(
        "Only images and videos are allowed. Other file types were ignored."
      );
    }

    // Create media entries only for valid files
    const newMedia = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video/") ? "video" : ("image" as const),
    }));

    setMedia((prev: any) => [...prev, ...newMedia]);
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
      // Inside handleSubmit function
      const logFormDataEntries = (formData: FormData) => {
        console.log("--- FormData Entries ---");
        for (const [key, value] of formData.entries()) {
          console.log(key, value);
        }
      };

      // Use it after creating formData
      logFormDataEntries(formData); // 👈 Add this

      // Example API call - replace with your actual API endpoint
      const response = await axios.post(
        "http://localhost:3000/post",
        formData,
        {
          withCredentials: true,
        }
      );
      if (!response) {
        alert("failed");
      } else {
        alert("success");
      }

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
      {/* Step indicator */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-bold">
          {step === "media" ? "Add Media" : "Create Post"}
        </h2>
        <div className="flex items-center">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              step === "media" ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></div>
          <div className="mx-1 h-0.5 w-4 bg-gray-300"></div>
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              step === "description" ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></div>
        </div>
      </div>

      {/* Media upload step */}
      {step === "media" && (
        <div className="space-y-4">
          {/* Media preview */}
          {media.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square rounded-lg border bg-gray-100 overflow-hidden"
                >
                  {item.type === "image" ? (
                    <img
                      src={item.preview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.preview}
                      className="h-full w-full object-cover"
                      controls
                    />
                  )}
                  <button
                    onClick={() => removeMedia(item.id)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black bg-opacity-60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drag and drop area */}
          <div
            className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:bg-gray-50"
            }`}
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
              accept="image/*,video/*"
              className="hidden"
            />
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="mb-1 text-sm font-medium text-gray-900">
              {dragActive
                ? "Drop files here"
                : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-gray-500">
              Images and videos supported (max 10MB)
            </p>
          </div>

          {/* Next button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={goToDescription}
              disabled={media.length === 0}
              className={`rounded-lg px-6 py-2.5 text-white transition-colors ${
                media.length === 0
                  ? "cursor-not-allowed bg-gray-300"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Description step */}
      {step === "description" && (
        <div className="space-y-4">
          {/* Media preview (small) */}
          {media.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="relative h-16 w-16 overflow-hidden rounded-md border"
                >
                  {item.type === "image" ? (
                    <img
                      src={item.preview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={goBackToMedia}
                className="flex h-16 w-16 items-center justify-center rounded-md border bg-gray-50 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
          )}

          {/* Description textarea */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              What's on your mind?
            </label>
            <textarea
              id="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write something..."
              className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={goBackToMedia}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`rounded-lg px-6 py-2.5 text-white transition-colors ${
                isSubmitting
                  ? "cursor-wait bg-blue-400"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Posting..." : "Create Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostForm;
