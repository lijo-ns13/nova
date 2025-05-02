import type React from "react";

import { useState } from "react";
import NewModal from "../modals/NewModal";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import CreatePostForm from "./CreatePostForm";

// ✨ Create a props type
interface CreatePostSectionProps {
  onPostSubmit?: () => void; // It's optional and a function returning void
}

interface PostData {
  description: string;
  media: {
    id: string;
    file: File;
    preview: string;
    type: "image" | "video";
  }[];
}

const CreatePostSection: React.FC<CreatePostSectionProps> = ({
  onPostSubmit,
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { profilePicture } = useAppSelector((state) => state.auth);

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

      data.media.forEach((item, index) => {
        formData.append(`media[${index}]`, item.file);
      });

      // Example API call - replace with your actual API endpoint
      // const response = await fetch('/api/posts', {
      //   method: 'POST',
      //   body: formData,
      // });

      // if (!response.ok) throw new Error('Failed to create post');

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Call the onPostSubmit callback if provided
      if (onPostSubmit) {
        onPostSubmit();
      }

      // Close the modal
      handleCloseModal();

      // Show success message or update UI
      console.log("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle error (show error message, etc.)
    }
  };

  return (
    <>
      {/* Post Starter Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 mb-6 overflow-hidden w-full">
        <div className="p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex-shrink-0 flex items-center justify-center text-white overflow-hidden">
              <img
                src={profilePicture || "/placeholder.svg"}
                alt="Profile"
                className="h-full w-full object-cover rounded-full"
              />
            </div>
            <div
              className="flex-grow bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-full px-4 py-2 cursor-pointer transition-all"
              onClick={handleOpenModal}
            >
              <div className="text-gray-500">Start a post</div>
            </div>
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
        />
      </NewModal>
    </>
  );
};

export default CreatePostSection;
