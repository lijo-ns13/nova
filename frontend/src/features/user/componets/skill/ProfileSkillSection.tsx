import React, { useEffect, useState } from "react";
import SkillAddModal from "./SkillModal"; // adjust path
import userAxios from "../../../../utils/userAxios";
interface Skill {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}
const ProfileSkillsSection: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchSkills = async () => {
    const res = await userAxios.get(
      `${import.meta.env.VITE_API_BASE_URL}/userskills`,
      {
        withCredentials: true,
      }
    );
    if (res.data.success && Array.isArray(res.data.data)) {
      const fetchedSkills = res.data.data.map((skill: Skill) => {
        // Normalize skill title: capitalize first letter
        const title = skill.title?.trim();
        return title.charAt(0).toUpperCase() + title.slice(1);
      });
      setSkills(fetchedSkills);
    } else {
      console.error("Unexpected response format:", res.data);
    }
    console.log(res, "skuii");
  };
  useEffect(() => {
    fetchSkills();
  }, []);
  const handleSaveSkills = async (updatedSkills: string[]) => {
    setSkills(updatedSkills);
    const res = await userAxios.post(
      `${import.meta.env.VITE_API_BASE_URL}/userskills`
    );
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
