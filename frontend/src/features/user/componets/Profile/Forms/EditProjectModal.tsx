import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import BaseModal from "../../modals/BaseModal";
import {
  UpdateProjectInputDTO,
  UpdateProjectInputSchema,
} from "../../../schema/projectSchema";
import { editProject } from "../../../services/ProfileService";
import { ProjectResponseDTO } from "../../../dto/projectResponse.dto";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectResponseDTO | null; // project to edit
  userId: string;
  onProjectUpdated: (updated: ProjectResponseDTO) => void;
}

const EditProjectModal = ({
  isOpen,
  onClose,
  project,
  userId,
  onProjectUpdated,
}: EditProjectModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProjectInputDTO>({
    resolver: zodResolver(UpdateProjectInputSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      projectUrl: "",
      technologies: [],
    },
  });

  // Populate form when project is provided
  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        startDate: new Date(project.startDate).toISOString().split("T")[0],
        endDate: project.endDate
          ? new Date(project.endDate).toISOString().split("T")[0]
          : "",
        projectUrl: project.projectUrl || "",
        technologies: project.technologies,
      });
    }
  }, [project, reset]);

  const onSubmit = async (data: UpdateProjectInputDTO) => {
    if (!project) return;
    try {
      const updated = await editProject(userId, project.id, data);
      toast.success("Project updated successfully");
      onProjectUpdated(updated);
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to update project");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Project">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input type="text" {...register("title")} className="input" />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea {...register("description")} className="input" rows={3} />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Project URL</label>
          <input type="text" {...register("projectUrl")} className="input" />
          {errors.projectUrl && (
            <p className="text-red-500">{errors.projectUrl.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Start Date</label>
          <input type="date" {...register("startDate")} className="input" />
          {errors.startDate && (
            <p className="text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">End Date</label>
          <input type="date" {...register("endDate")} className="input" />
          {errors.endDate && (
            <p className="text-red-500">{errors.endDate.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">
            Technologies (comma separated)
          </label>
          <input
            type="text"
            className="input"
            defaultValue={project?.technologies?.join(", ")}
            onBlur={(e) => {
              const techs = e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t);
              reset((prev) => ({ ...prev, technologies: techs }));
            }}
          />
          {errors.technologies && (
            <p className="text-red-500">{errors.technologies.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full"
        >
          {isSubmitting ? "Updating..." : "Update Project"}
        </button>
      </form>
    </BaseModal>
  );
};

export default EditProjectModal;
