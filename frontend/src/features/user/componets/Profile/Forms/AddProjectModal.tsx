import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import BaseModal from "../../modals/BaseModal";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import { addProject } from "../../../services/ProfileService";
import {
  CreateProjectInputDTO,
  CreateProjectInputSchema,
} from "../../../schema/projectSchema";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
}

export default function AddProjectModal({
  isOpen,
  onClose,
  onProjectAdded,
}: AddProjectModalProps) {
  const { id } = useAppSelector((state) => state.auth);
  const [techInput, setTechInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInputDTO>({
    resolver: zodResolver(CreateProjectInputSchema),
    defaultValues: {
      title: "",
      description: "",
      projectUrl: "",
      startDate: "",
      endDate: "",
      technologies: [],
    },
  });

  const handleTechAdd = () => {
    const tech = techInput.trim();
    if (tech) {
      const updatedTechs = [...getValues("technologies"), tech];
      setValue("technologies", updatedTechs);
      setTechInput("");
    }
  };

  const handleTechRemove = (index: number) => {
    const updated = [...getValues("technologies")];
    updated.splice(index, 1);
    setValue("technologies", updated);
  };

  const handleClose = () => {
    onClose();
    reset(); // clear form on close
    setTechInput("");
  };

  const onSubmit = async (data: CreateProjectInputDTO) => {
    try {
      await addProject(id, data);
      toast.success("Project added successfully");
      onProjectAdded();
      handleClose();
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("Failed to add project");
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Add Project">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <input
            {...register("title")}
            placeholder="Project Title"
            className={`w-full border px-3 py-2 rounded ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <textarea
            {...register("description")}
            placeholder="Project Description"
            className={`w-full border px-3 py-2 rounded ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Project URL */}
        <div>
          <input
            {...register("projectUrl")}
            placeholder="Project URL (optional)"
            className={`w-full border px-3 py-2 rounded ${
              errors.projectUrl ? "border-red-500" : ""
            }`}
          />
          {errors.projectUrl && (
            <p className="text-red-500 text-sm mt-1">
              {errors.projectUrl.message}
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm text-gray-600">Start Date</label>
            <input
              type="date"
              {...register("startDate")}
              className={`w-full border px-3 py-2 rounded ${
                errors.startDate ? "border-red-500" : ""
              }`}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label className="text-sm text-gray-600">End Date (optional)</label>
            <input
              type="date"
              {...register("endDate")}
              className={`w-full border px-3 py-2 rounded ${
                errors.endDate ? "border-red-500" : ""
              }`}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Technologies */}
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
          {errors.technologies && (
            <p className="text-red-500 text-sm mt-1">
              {errors.technologies.message}
            </p>
          )}

          <div className="flex flex-wrap mt-2 gap-2">
            {getValues("technologies").map((tech, index) => (
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Project"}
        </button>
      </form>
    </BaseModal>
  );
}
