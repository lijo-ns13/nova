import { UserData, Project } from "../../../../../types/profile";
import { FolderKanban, Plus, ExternalLink } from "lucide-react";
import { formatDate, parseTechnologies } from "../../../../../utils/formatters";

interface ProjectSectionProps {
  userData: UserData;
}

const ProjectItem = ({ project }: { project: Project }) => {
  const technologies = parseTechnologies(project.technologies);

  return (
    <div className="border border-gray-100 hover:border-gray-300 p-5 transition-all duration-300 group rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-base tracking-tight">
            {project.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(project.startDate)} - {formatDate(project.endDate)}
          </p>
        </div>

        {project.projectUrl && (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 transition-colors rounded"
          >
            View
            <ExternalLink className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
          </a>
        )}
      </div>

      {project.description && (
        <p className="mt-3 text-gray-600 text-sm font-light leading-relaxed">
          {project.description}
        </p>
      )}

      {technologies.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectSectionViewable = ({ userData }: ProjectSectionProps) => {
  const projects = userData?.projects || [];

  return (
    <section className="bg-white shadow-sm border border-gray-100 p-6 md:p-8 transform transition-all duration-300 hover:shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center uppercase tracking-wider">
          <FolderKanban className="w-5 h-5 mr-3 text-gray-400" />
          Projects
        </h2>
        <button className="text-black hover:bg-gray-100 p-2 transition-colors rounded-full">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-6">
          {projects.map((project) => (
            <ProjectItem key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-50 p-6 mb-4">
            <FolderKanban className="w-10 h-10 text-gray-300" />
          </div>
          <p className="text-gray-400 font-light">No projects listed yet</p>
          <button className="mt-4 text-black border-b border-black hover:border-transparent transition-colors text-sm font-medium">
            Add project
          </button>
        </div>
      )}
    </section>
  );
};

export default ProjectSectionViewable;
