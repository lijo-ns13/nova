import { useState } from "react";
import BaseModal from "../../modals/BaseModal";
import { addProject } from "../../../services/ProfileService";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import toast from "react-hot-toast";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
}

interface ProjectFormData {
  title: string;
  description: string;
  projectUrl?: string;
  startDate: string;
  endDate?: string;
  technologies: string[];
}

export default function AddProjectModal({
  isOpen,
  onClose,
  onProjectAdded,
}: AddProjectModalProps) {
  const { id } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    projectUrl: "",
    startDate: "",
    endDate: "",
    technologies: [],
  });

  const [techInput, setTechInput] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechAdd = () => {
    if (techInput.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const handleTechRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProject(id, formData);
      toast.success("Add new project successfully");
      onProjectAdded();
      onClose();
      setFormData({
        title: "",
        description: "",
        projectUrl: "",
        startDate: "",
        endDate: "",
        technologies: [],
      });
    } catch (error) {
      toast.error("failed to add project");
      console.error("Failed to submit form:", error);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add Project">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="url"
          name="projectUrl"
          placeholder="Project URL (optional)"
          value={formData.projectUrl}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm text-gray-600">End Date (optional)</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Technologies Used</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              placeholder="Enter technology"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="flex-1 border px-3 py-2 rounded"
            />
            <button
              type="button"
              onClick={handleTechAdd}
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap mt-2 gap-2">
            {formData.technologies.map((tech, index) => (
              <span
                key={index}
                className="bg-gray-200 px-2 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleTechRemove(index)}
                  className="text-red-600 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Add Project
        </button>
      </form>
    </BaseModal>
  );
}
