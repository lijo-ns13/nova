"use client";

import { useState } from "react";
import BaseModal from "../modals/BaseModal";
import ChangePasswordForm from "./ChangePasswordForm";
import { Key, Briefcase, GraduationCap, Award, FolderPlus } from "lucide-react";

function AddSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const handleOpenModal = (action: string) => {
    setActiveAction(action);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setActiveAction(null), 300); // Reset after animation
  };

  // Array of available actions
  const profileActions = [
    { id: "password", label: "Change Password", icon: "key" },
    // { id: "experience", label: "Add Experience", icon: "briefcase" },
    // { id: "education", label: "Add Education", icon: "academic-cap" },
    // { id: "certificate", label: "Add Certificate", icon: "badge-check" },
    // { id: "project", label: "Add Project", icon: "document-add" },
  ];

  // Get title and content based on active action
  const getModalContent = () => {
    switch (activeAction) {
      case "password":
        return {
          title: "Change Your Password",
          content: <ChangePasswordForm onComplete={handleCloseModal} />,
        };

      default:
        return { title: "", content: null };
    }
  };

  // Render icon based on name
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "key":
        return <Key className="h-4 w-4" />;
      case "briefcase":
        return <Briefcase className="h-4 w-4" />;
      case "academic-cap":
        return <GraduationCap className="h-4 w-4" />;
      case "badge-check":
        return <Award className="h-4 w-4" />;
      case "document-add":
        return <FolderPlus className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const modalContent = getModalContent();

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {profileActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleOpenModal(action.id)}
            className="inline-flex items-center px-3 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <span className="text-indigo-600 mr-2">
              {renderIcon(action.icon)}
            </span>
            {action.label}
          </button>
        ))}
      </div>

      {isModalOpen && (
        <BaseModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={modalContent.title}
        >
          {modalContent.content}
        </BaseModal>
      )}
    </>
  );
}

export default AddSection;
