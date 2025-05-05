// CreateJobPage.tsx
import { useState } from "react";
import CreateJobForm from "../components/Job/CreateJobForm";
import BigModal from "../../user/componets/modals/BigModal";
import JobPostingForm from "../components/JobPostingForm";
function CreateJobPage({ onJobCreated }: { onJobCreated: () => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSuccess = () => {
    closeModal();
    onJobCreated(); // <-- refresh jobs list
  };

  return (
    <>
      <button
        onClick={openModal}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        ADD Jobs
      </button>

      <BigModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Create New Job"
      >
        <JobPostingForm onSuccess={handleSuccess} />
      </BigModal>
    </>
  );
}

export default CreateJobPage;
