import { useEffect, useState } from "react";
import BaseModal from "../../modals/BaseModal";
import { editExperience } from "../../../services/ProfileService";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import toast from "react-hot-toast";
import {
  UpdateExperienceInputDTO,
  UpdateExperienceInputSchema,
} from "../../../schema/experienceSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleApiError } from "../../../../../utils/apiError";
import { ExperienceResponseDTO } from "../../../dto/experienceResponse.dto";

interface EditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: ExperienceResponseDTO;
  onExperienceUpdated: () => void;
}

export default function EditExperienceModal({
  isOpen,
  onClose,
  experience,
  onExperienceUpdated,
}: EditExperienceModalProps) {
  const { id } = useAppSelector((state) => state.auth);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateExperienceInputDTO>({
    resolver: zodResolver(UpdateExperienceInputSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  useEffect(() => {
    if (experience) {
      reset({
        title: experience.title,
        company: experience.company,
        location: experience.location,
        startDate: experience.startDate.split("T")[0],
        endDate: experience.endDate?.split("T")[0] ?? "",
        description: experience.description ?? "",
      });
    }
  }, [experience, reset]);

  const onSubmit = async (data: UpdateExperienceInputDTO) => {
    try {
      await editExperience(id, experience.id, data);
      toast.success("Experience updated successfully");
      onExperienceUpdated();
      handleClose();
    } catch (err: unknown) {
      const parsed = handleApiError(err, "Failed to update experience");

      setGlobalError(parsed.message ?? "Something went wrong");

      if (parsed.errors) {
        Object.entries(parsed.errors).forEach(([key, value]) => {
          setError(key as keyof UpdateExperienceInputDTO, {
            type: "manual",
            message: value,
          });
        });
      }
    }
  };

  const handleClose = () => {
    reset();
    setGlobalError(null);
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Edit Experience">
      {globalError && (
        <p className="text-red-600 text-sm font-medium text-center">
          {globalError}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            {...register("title")}
            placeholder="Job Title"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            {...register("company")}
            placeholder="Company Name"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">
              {errors.company.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            {...register("location")}
            placeholder="Location"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="date"
            {...register("startDate")}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="date"
            {...register("endDate")}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.endDate.message}
            </p>
          )}
        </div>

        <div>
          <textarea
            {...register("description")}
            placeholder="Description (optional)"
            className="w-full border px-3 py-2 rounded"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full hover:bg-indigo-700"
        >
          Update Experience
        </button>
      </form>
    </BaseModal>
  );
}
