import { useEffect, useState } from "react";
import BaseModal from "../../modals/BaseModal";
import { editEducation } from "../../../services/ProfileService";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import toast from "react-hot-toast";
import {
  UpdateEducationInputDTO,
  UpdateEducationInputSchema,
} from "../../../schema/educationSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleApiError } from "../../../../../utils/apiError";
import { EducationResponseDTO } from "../../../dto/educationResponse.dto";

interface EditEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  education: EducationResponseDTO;
  onEducationUpdated: () => void;
}

export default function EditEducationModal({
  isOpen,
  onClose,
  education,
  onEducationUpdated,
}: EditEducationModalProps) {
  const { id } = useAppSelector((state) => state.auth);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateEducationInputDTO>({
    resolver: zodResolver(UpdateEducationInputSchema),
    defaultValues: {
      institutionName: "",
      degree: "",
      fieldOfStudy: "",
      grade: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  useEffect(() => {
    if (education) {
      const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "";
        return d.toISOString().split("T")[0]; // "2025-07-08"
      };

      reset({
        institutionName: education.institutionName,
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy ?? "",
        grade: education.grade ?? "",
        startDate: formatDate(education.startDate),
        endDate: formatDate(education.endDate),
        description: education.description ?? "",
      });
    }
  }, [education, reset]);

  const onSubmit = async (data: UpdateEducationInputDTO) => {
    try {
      const cleanedData = {
        ...data,
        endDate: data.endDate?.trim() === "" ? undefined : data.endDate,
      };
      await editEducation(id, education.id, cleanedData);
      toast.success("Education updated successfully");
      onEducationUpdated();
      handleClose();
    } catch (err: unknown) {
      const parsed = handleApiError(err, "Failed to update education");

      setGlobalError(parsed.message ?? "Something went wrong");

      if (parsed.errors) {
        Object.entries(parsed.errors).forEach(([key, value]) => {
          setError(key as keyof UpdateEducationInputDTO, {
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
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Edit Education">
      {globalError && (
        <p className="text-red-600 text-sm font-medium text-center">
          {globalError}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            {...register("institutionName")}
            placeholder="Institution Name"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.institutionName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.institutionName.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            {...register("degree")}
            placeholder="Degree"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.degree && (
            <p className="text-red-500 text-sm mt-1">{errors.degree.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            {...register("fieldOfStudy")}
            placeholder="Field of Study"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.fieldOfStudy && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fieldOfStudy.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            {...register("grade")}
            placeholder="Grade (optional)"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.grade && (
            <p className="text-red-500 text-sm mt-1">{errors.grade.message}</p>
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
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          Update Education
        </button>
      </form>
    </BaseModal>
  );
}
