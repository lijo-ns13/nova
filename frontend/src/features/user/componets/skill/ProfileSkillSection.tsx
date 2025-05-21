import React, { useState } from "react";
import SkillAddModal from "./SkillModal"; // adjust path

const ProfileSkillsSection: React.FC = () => {
  const [skills, setSkills] = useState<string[]>(["React", "TypeScript"]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveSkills = (updatedSkills: string[]) => {
    setSkills(updatedSkills);
    console.log("updated skills,", updatedSkills);
    // You can also make an API call to save updated skills here
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-2 px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Add / Edit Skills
      </button>

      <SkillAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        skills={skills}
        onSave={handleSaveSkills}
      />
    </div>
  );
};

export default ProfileSkillsSection;
