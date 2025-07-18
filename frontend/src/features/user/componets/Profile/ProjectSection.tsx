import { useEffect, useState } from "react";
import AddProjectModal from "./Forms/AddProjectModal";
import { getProjects, deleteProject } from "../../services/ProfileService";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import ConfirmDialog from "../../../../components/ConfirmDiolog";
import toast from "react-hot-toast";
import { ProjectResponseDTO } from "../../dto/projectResponse.dto";
import EditProjectModal from "./Forms/EditProjectModal";

function ProjectSection() {
  const [projects, setProjects] = useState<ProjectResponseDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<ProjectResponseDTO | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useAppSelector((state) => state.auth);
  // for delete
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [editProjectModalOpen, setEditProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<ProjectResponseDTO | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setIsLoading(true);
      const res = await getProjects(id);
      setProjects(res);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setIsLoading(false);
    }
  }
  const handleEditClick = (project: ProjectResponseDTO) => {
    setSelectedProject(project);
    setEditProjectModalOpen(true);
  };
  const handleProjectAdded = () => {
    setIsModalOpen(false);
    setEditProject(null);
    fetchProjects();
  };

  const handleDeleteClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProjectId) return;

    setIsDeleting(true);

    try {
      await deleteProject(id, selectedProjectId);
      setProjects((prev) => prev.filter((p) => p.id !== selectedProjectId));
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setSelectedProjectId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDuration = (startDate: string, endDate?: string) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : "Present";
    return `${start} - ${end}`;
  };

  return (
    <div className="w-full py-8 bg-gray-50">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Projects
            </h2>
            <p className="text-gray-600 mt-1">
              Showcase your work and demonstrate your skills
            </p>
          </div>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            onClick={() => {
              setEditProject(null);
              setIsModalOpen(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Project
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {project.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1.5 text-indigo-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {getDuration(project.startDate, project.endDate)}
                      </div>
                    </div>
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0"
                      >
                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center hover:bg-indigo-100 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-indigo-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </a>
                    )}
                  </div>

                  {project.description && (
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                  <button
                    onClick={() => handleEditClick(project)} //
                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Edit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(project.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-dashed border-gray-300 p-8 sm:p-12 text-center">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 sm:h-12 sm:w-12 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No projects added yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Showcase your work by adding projects you've worked on.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-all duration-200 inline-flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add Your First Project
            </button>
          </div>
        )}

        <AddProjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditProject(null);
          }}
          onProjectAdded={handleProjectAdded}
        />
        <EditProjectModal
          isOpen={editProjectModalOpen}
          onClose={() => setEditProjectModalOpen(false)}
          project={selectedProject}
          userId={id}
          onProjectUpdated={(updated) => {
            fetchProjects();
          }}
        />
        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Delete Project?"
          description="Are you sure you want to delete this project? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          isLoading={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsConfirmOpen(false);
            setSelectedProjectId(null);
          }}
        />
      </div>
    </div>
  );
}

export default ProjectSection;
