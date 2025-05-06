import { FormEvent, useEffect, useState } from "react";
import { SkillService } from "../services/skillServices";
import BaseModal from "../../user/componets/modals/BaseModal";
import { PlusCircle, Edit, Trash2, Loader2, Search } from "lucide-react";
import toast from "react-hot-toast";
import { ISkill } from "../types/skills";

export default function SkillList() {
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [title, setTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [addError, setAddError] = useState("");
  const [editError, setEditError] = useState("");
  const [editingSkill, setEditingSkill] = useState<ISkill | null>(null);
  const [createSkillModal, setCreateSkillModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, [currentPage, itemsPerPage, searchQuery]);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      const res = await SkillService.getSkills(
        currentPage,
        itemsPerPage,
        searchQuery
      );
      setSkills(res.data);
      setTotalItems(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to fetch skills");
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
    fetchSkills();
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleCreateSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setAddError("");

    try {
      await SkillService.createSkill({ title: title.trim().toLowerCase() });
      toast.success("Successfully added new skill");
      setTitle("");
      setCreateSkillModal(false);
      await fetchSkills();
    } catch (error: any) {
      setAddError(error.response?.data?.error || "Failed to create skill");
      toast.error("Failed to create skill");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (skillId: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      setIsLoading(true);
      await SkillService.deleteSkill(skillId);
      toast.success("Successfully deleted skill");
      // Reset to first page if we're on a page that might now be empty
      if (skills.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await fetchSkills();
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill");
    } finally {
      setIsLoading(false);
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
      toast.success("Successfully updated skill");
      setEditTitle("");
      await fetchSkills();
    } catch (error: any) {
      setEditError(error.response?.data?.error || "Failed to update skill");
      toast.error("Failed to update skill");
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

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(renderPageButton(i));
      }
    } else {
      // Always show first page
      buttons.push(renderPageButton(1));

      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        buttons.push(
          <span key="start-ellipsis" className="px-3 py-1">
            ...
          </span>
        );
      }

      // Show current page and neighbors
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        buttons.push(renderPageButton(i));
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="end-ellipsis" className="px-3 py-1">
            ...
          </span>
        );
      }

      // Always show last page
      buttons.push(renderPageButton(totalPages));
    }

    return buttons;
  };

  const renderPageButton = (page: number) => {
    return (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`px-3 py-1 border rounded-md text-sm ${
          currentPage === page
            ? "bg-indigo-600 text-white border-indigo-600"
            : "border-gray-300 hover:bg-gray-50"
        }`}
      >
        {page}
      </button>
    );
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

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            </div>
          )}
        </div>
      </form>

      {/* Skills List */}
      <div className="mt-6">
        {isLoading && skills.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-indigo-600" size={24} />
          </div>
        ) : skills.length === 0 ? (
          <div className="bg-gray-50 p-8 text-center rounded-lg">
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? "No skills match your search. Try a different query."
                : "No skills found. Add your first skill!"}
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

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            skills
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            {renderPaginationButtons()}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

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
