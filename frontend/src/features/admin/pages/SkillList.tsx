import { FormEvent, useEffect, useState } from "react";
import { SkillService } from "../services/skillServices";
import BaseModal from "../../user/componets/modals/BaseModal";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Skill } from "../types/skills";

export default function SkillList() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [title, setTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [addError, setAddError] = useState("");
  const [editError, setEditError] = useState("");
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [createSkillModal, setCreateSkillModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await SkillService.getSkills();
      setSkills(res);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const handleCreateSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setAddError("");

    try {
      await SkillService.createSkill({ title: title.trim().toLowerCase() });
      toast.success("successfully added new skill");
      setTitle("");
      setCreateSkillModal(false);
      await fetchSkills();
    } catch (error: any) {
      setAddError(error.response?.data?.error || "Failed to create skill");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (skillId: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      await SkillService.deleteSkill(skillId);
      toast.success("successfully deleted");
      await fetchSkills();
    } catch (error) {
      console.error("Error deleting skill:", error);
    }
  };

  const handleUpdateSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingSkill) return;
    setIsLoading(true);
    setEditError("");

    try {
      await SkillService.updateSkill(editingSkill._id, {
        title: editTitle.trim().toLowerCase(),
      });
      setEditingSkill(null);
      toast.success("succesully updated");
      setEditTitle("");
      await fetchSkills();
    } catch (error: any) {
      setEditError(error.response?.data?.error || "Failed to update skill");
    } finally {
      setIsLoading(false);
    }
  };

  const closeCreateModal = () => {
    setCreateSkillModal(false);
    setTitle("");
    setAddError("");
  };

  const closeEditModal = () => {
    setEditingSkill(null);
    setEditTitle("");
    setEditError("");
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Skills Management</h2>
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
          onClick={() => setCreateSkillModal(true)}
        >
          <PlusCircle size={18} />
          <span>Add New Skill</span>
        </button>
      </div>

      <div className="mt-6">
        {skills.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <p className="text-gray-500 text-lg">
              No skills found. Add your first skill!
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {skills.map((skill) => (
                <li
                  key={skill._id}
                  className="flex justify-between items-center px-6 py-4 hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-700 capitalize">
                    {skill.title}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                      onClick={() => {
                        setEditingSkill(skill);
                        setEditTitle(skill.title);
                      }}
                      aria-label="Edit skill"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="flex items-center justify-center p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                      onClick={() => handleDelete(skill._id)}
                      aria-label="Delete skill"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Create Skill Modal */}
      <BaseModal
        isOpen={createSkillModal}
        onClose={closeCreateModal}
        title="Add New Skill"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="skillTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Skill Name
            </label>
            <input
              id="skillTitle"
              type="text"
              placeholder="Enter skill name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {addError && <p className="text-red-600 text-sm">{addError}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={closeCreateModal}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              disabled={!title.trim() || isLoading}
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Adding..." : "Add Skill"}
            </button>
          </div>
        </form>
      </BaseModal>

      {/* Edit Skill Modal */}
      <BaseModal
        isOpen={!!editingSkill}
        onClose={closeEditModal}
        title="Edit Skill"
      >
        {editingSkill && (
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="editSkillTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Skill Name
              </label>
              <input
                id="editSkillTitle"
                type="text"
                placeholder="Edit skill name"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {editError && <p className="text-red-600 text-sm">{editError}</p>}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={closeEditModal}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                disabled={!editTitle.trim() || isLoading}
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                {isLoading ? "Updating..." : "Update Skill"}
              </button>
            </div>
          </form>
        )}
      </BaseModal>
    </div>
  );
}
