import React, { useState } from "react";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input"
import {
  updateProfileImage,
  deleteProfileImage,
} from "../../services/companyProfileService";
import { X, Upload, Trash2 } from "lucide-react";

interface ProfileImageModalProps {
  currentImageUrl?: string;
  isOpen: boolean;
  onClose: () => void;
  onImageUpdate: (imageUrl: string) => void;
  onImageDelete: () => void;
}

const ProfileImageModal: React.FC<ProfileImageModalProps> = ({
  currentImageUrl,
  isOpen,
  onClose,
  onImageUpdate,
  onImageDelete,
}) => {
  const [imageUrl, setImageUrl] = useState(currentImageUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!imageUrl.trim()) {
      setError("Please enter an image URL");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await updateProfileImage(imageUrl);
      if (response.success) {
        onImageUpdate(imageUrl);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Failed to update profile image");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteProfileImage();
      if (response.success) {
        onImageDelete();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete profile image");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Update Profile Image
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            {/* Preview */}
            {imageUrl && (
              <div className="mb-4 flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-200">
                  <img
                    src={imageUrl}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                    onError={() => setError("Invalid image URL")}
                  />
                </div>
              </div>
            )}

            <Input
              label="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              error={error}
              hint="Enter a valid image URL"
            />

            {currentImageUrl && (
              <div className="mt-4 flex justify-between items-center">
                <Button
                  type="button"
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  className="flex items-center"
                  icon={<Trash2 size={16} />}
                >
                  Delete Image
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              icon={<Upload size={16} />}
            >
              Update Image
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileImageModal;
