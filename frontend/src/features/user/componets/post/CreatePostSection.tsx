import { useState } from "react";
import { Image, Video, FileText } from "lucide-react";
import Avatar from "../ui/Avatar";
import NewModal from "../modals/NewModal";
import CreatePostForm from "./CreatePostForm";
import { useAppSelector } from "../../../../hooks/useAppSelector";

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
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { profilePicture, name } = useAppSelector((state) => state.auth);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePostSubmit = async (data: PostData) => {
    try {
      // Create form data for backend submission
      const formData = new FormData();
      formData.append("description", data.description);

      data.media.forEach((item) => {
        formData.append(`media`, item.file);
      });

      // Example API call - replace with your actual API endpoint
      const response = await fetch("http://localhost:3000/post", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create post");

      // Call the onPostSubmit callback if provided
      if (onPostSubmit) {
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
            <Avatar
              src={profilePicture}
              alt={name || "Your profile"}
              size="md"
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

            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 py-1.5 px-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
            >
              <FileText size={18} className="text-amber-500" />
              <span>Document</span>
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
    </>
  );
};

export default CreatePostSection;
