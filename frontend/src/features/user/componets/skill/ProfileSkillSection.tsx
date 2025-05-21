import React, { useEffect, useState } from "react";
import SkillAddModal from "./SkillModal";
import userAxios from "../../../../utils/userAxios";

interface Skill {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const ProfileSkillsSection: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch skills
  const fetchSkills = async () => {
    try {
      const res = await userAxios.get(
        `${import.meta.env.VITE_API_BASE_URL}/userskills`,
        { withCredentials: true }
      );

      if (res.data.success && Array.isArray(res.data.data)) {
        const normalized = res.data.data.map((skill: Skill) => ({
          ...skill,
          title:
            skill.title.charAt(0).toUpperCase() +
            skill.title.slice(1).toLowerCase(),
        }));
        setSkills(normalized);
      } else {
        console.error("Unexpected response:", res.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSaveSkills = async (updatedTitles: string[]) => {
    try {
      const res = await userAxios.post(
        `${import.meta.env.VITE_API_BASE_URL}/userskills`,
        { skills: updatedTitles }, // Assuming API expects { skills: ["Java", "React"] }
        { withCredentials: true }
      );

      if (res.data.success) {
        // Refresh with latest data from backend
        fetchSkills();
      }
    } catch (error) {
      console.error("Error saving skills:", error);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Skills</h3>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill._id}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
          >
            {skill.title}
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
        skills={skills.map((skill) => skill.title)} // Convert to string[]
        onSave={handleSaveSkills}
      />
    </div>
  );
};

export default ProfileSkillsSection;
