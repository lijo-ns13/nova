import React from "react";
import SkillsInput from "../../../company/components/Job/SkillsInput";
import BaseModal from "../modals/BaseModal";

interface SkillAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: string[]; // Just titles here
  onSave: (updatedSkills: string[]) => void;
  error?: string;
}

const SkillAddModal: React.FC<SkillAddModalProps> = ({
  isOpen,
  onClose,
  skills,
  onSave,
  error,
}) => {
  const [localSkills, setLocalSkills] = React.useState<string[]>(skills);

  const handleSave = () => {
    onSave(localSkills);
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      setLocalSkills(skills); // Reset when modal opens
    }
  }, [isOpen, skills]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add Your Skills">
      <SkillsInput
        value={localSkills}
        onChange={setLocalSkills}
        error={!!error} // Convert string | undefined to boolean
      />

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </BaseModal>
  );
};

export default SkillAddModal;
