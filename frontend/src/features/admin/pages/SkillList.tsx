import { FormEvent, useEffect, useState } from "react";
import { SkillService } from "../services/skillServices";
import BaseModal from "../../user/componets/modals/BaseModal";
import {
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { ParsedAPIError } from "../../../utils/apiError";
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
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSkills();
  }, [currentPage, itemsPerPage, searchQuery]);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const res = await SkillService.getSkills(
        currentPage,
        itemsPerPage,
        searchQuery
      );
      setSkills(res.skills);
      setTotalItems(res.total);
      setTotalPages(Math.ceil(res.total / res.limit));
    } catch (error) {
      toast.error("Failed to fetch skills");
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAddError("");

    try {
      const res = await SkillService.createSkill({
        title: title.trim().toLowerCase(),
      });
      toast.success("Skill created successfully");
      setTitle("");
      setCreateSkillModal(false);

      // Optimistic update - add to beginning of list
      setSkills([res, ...skills]);

      // If we're on page 1, we might need to adjust pagination
      if (currentPage === 1 && skills.length >= itemsPerPage) {
        setTotalItems((prev) => prev + 1);
      }
    } catch (error) {
      const apiError = error as ParsedAPIError;
      setAddError(
        apiError.errors?.title || apiError.message || "Failed to create skill"
      );
      toast.error("Failed to create skill");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    setIsLoading(true);
    setEditError("");

    try {
      const res = await SkillService.updateSkill(editingSkill.id, {
        title: editTitle.trim().toLowerCase(),
      });
      toast.success("Skill updated successfully");
      setEditingSkill(null);
      setEditTitle("");

      // Optimistic update
      setSkills(
        skills.map((skill) => (skill.id === editingSkill.id ? res : skill))
      );
    } catch (error) {
      const apiError = error as ParsedAPIError;
      setEditError(
        apiError.errors?.title || apiError.message || "Failed to update skill"
      );
      toast.error("Failed to update skill");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    setIsDeleting(id);

    try {
      await SkillService.deleteSkill(id);
      toast.success("Skill deleted successfully");

      // Optimistic update
      const newSkills = skills.filter((skill) => skill.id !== id);
      setSkills(newSkills);

      // Update pagination if needed
      if (newSkills.length === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        setTotalItems((prev) => prev - 1);
      }
    } catch (error) {
      toast.error("Failed to delete skill");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
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

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Skills Management
          </h1>

          {/* Search and Create */}
          <div className="w-full md:w-auto">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                type="submit"
                disabled={isSearching}
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                onClick={() => setCreateSkillModal(true)}
                type="button"
              >
                <PlusCircle className="w-4 h-4" />
                Add Skill
              </button>
            </form>
          </div>
        </div>

        {/* Skill Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            {isLoading && skills.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skill
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {skills.map((skill) => (
                    <tr key={skill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {skill.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {skill.createdBy}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                            onClick={() => {
                              setEditingSkill(skill);
                              setEditTitle(skill.title);
                            }}
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                            onClick={() => handleDelete(skill.id)}
                            disabled={isDeleting === skill.id}
                            title="Delete"
                          >
                            {isDeleting === skill.id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {skills.length === 0 && !isLoading && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No skills found.{" "}
                        {searchQuery && "Try a different search."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, totalItems)}
                </span>{" "}
                of <span className="font-medium">{totalItems}</span> results
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[5, 10, 20, 50].map((count) => (
                      <option key={count} value={count}>
                        Show {count}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 border text-sm font-medium ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-50"
                        } rounded-md`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <BaseModal
        isOpen={createSkillModal}
        onClose={() => setCreateSkillModal(false)}
        title="Add New Skill"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="skill-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Skill Name
            </label>
            <input
              id="skill-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter skill name"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              autoFocus
            />
          </div>
          {addError && <p className="text-sm text-red-600">{addError}</p>}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateSkillModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5 mx-4" />
              ) : (
                "Create Skill"
              )}
            </button>
          </div>
        </form>
      </BaseModal>

      {/* Edit Modal */}
      <BaseModal
        isOpen={!!editingSkill}
        onClose={() => setEditingSkill(null)}
        title={`Edit Skill: ${editingSkill?.title || ""}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-skill-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Skill Name
            </label>
            <input
              id="edit-skill-title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter skill name"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              autoFocus
            />
          </div>
          {editError && <p className="text-sm text-red-600">{editError}</p>}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingSkill(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5 mx-4" />
              ) : (
                "Update Skill"
              )}
            </button>
          </div>
        </form>
      </BaseModal>
    </div>
  );
}
