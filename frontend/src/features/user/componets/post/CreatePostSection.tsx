import { useState } from "react";
import { Image, Video } from "lucide-react";
import Avatar from "../ui/Avatar";
import NewModal from "../modals/NewModal";
import CreatePostForm from "./CreatePostForm";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { updateCreatePostCount } from "../../../auth/auth.slice";
import BaseModal from "../modals/BaseModal";
import { SecureCloudinaryImage } from "../../../../components/SecureCloudinaryImage";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const postLimit = import.meta.env.VITE_POST_CREATION_COUNT || 2;
const BASE_URL = `${API_BASE_URL}`;
interface CreatePostSectionProps {
  onPostSubmit?: () => void;
}

interface PostData {
  description: string;
  media: {
    id: string;
    file: File;
    preview: string;
    type: "image" | "video" | "file";
  }[];
}

const CreatePostSection: React.FC<CreatePostSectionProps> = ({
  onPostSubmit,
}) => {
  const dispath = useAppDispatch();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { profilePicture, name, isSubscriptionTaken, createdPostCount } =
    useAppSelector((state) => state.auth);

  const [showSubscriptionModal, setShowSubscriptionModal] =
    useState<boolean>(false);
  const handleCloseSubscriptionModal = () => {
    setShowSubscriptionModal(false);
  };
  const handleOpenModal = () => {
    if (
      !isSubscriptionTaken &&
      createdPostCount &&
      createdPostCount >= postLimit
    ) {
      setShowSubscriptionModal(true); // Show subscription modal
      return;
    }
    setOpenModal(true); // Otherwise, allow post creation
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePostSubmit = async (data: PostData) => {
    try {
      if (
        !isSubscriptionTaken &&
        createdPostCount &&
        createdPostCount >= postLimit
      ) {
        setShowSubscriptionModal(true); // Show modal if limit reached
        handleCloseModal(); // Close post modal if it's open
        return; // Prevent post creation
      }
      // Create form data for backend submission
      const formData = new FormData();
      formData.append("description", data.description);

      data.media.forEach((item) => {
        formData.append(`media`, item.file);
      });

      // Example API call - replace with your actual API endpoint
      const response = await fetch(`${BASE_URL}/post`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create post");

      // Call the onPostSubmit callback if provided
      if (onPostSubmit) {
        if (createdPostCount) {
          dispath(updateCreatePostCount((createdPostCount || 0) + 1));
        }

        onPostSubmit();
      }

      // Close the modal
      handleCloseModal();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <>
      {/* Post creation card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-3">
            {/* <Avatar
              src={profilePicture}
              alt={name || "Your profile"}
              size="md"
            /> */}
            <SecureCloudinaryImage
              publicId={profilePicture}
              className="rounded-full w-10 h-10 object-cover"
            />
            <div
              onClick={handleOpenModal}
              className="flex-grow bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-4 py-2.5 cursor-pointer transition-all"
            >
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                What's on your mind?
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 py-1.5 px-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <Image size={18} className="text-indigo-500" />
              <span>Photo</span>
            </button>

            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 py-1.5 px-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <Video size={18} className="text-green-500" />
              <span>Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <NewModal
        isOpen={openModal}
        onClose={handleCloseModal}
        size="lg"
        showCloseButton={true}
      >
        <CreatePostForm
          onSubmit={handlePostSubmit}
          onClose={handleCloseModal}
          userProfilePic={profilePicture}
          userName={name}
        />
      </NewModal>
      <BaseModal
        isOpen={showSubscriptionModal}
        onClose={handleCloseSubscriptionModal}
        title="Free Access Limit Reached"
      >
        <div className="space-y-4">
          <p>
            You've reached your free post creation limit ({postLimit} posts). To
            continue creating posts, please subscribe.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCloseSubscriptionModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleCloseSubscriptionModal();
                window.location.href = "/subscription"; // Optional redirect
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </BaseModal>
    </>
  );
};

export default CreatePostSection;
