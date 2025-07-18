import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModal from "../../modals/BaseModal";
import { addEducation } from "../../../services/ProfileService";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import toast from "react-hot-toast";
import {
  CreateEducationInputDTO,
  CreateEducationInputSchema,
} from "../../../schema/educationSchema";
import { handleApiError } from "../../../../../utils/apiError";

interface AddEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEducationAdded: () => void;
}

export default function AddEducationModal({
  isOpen,
  onClose,
  onEducationAdded,
}: AddEducationModalProps) {
  const { id } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateEducationInputDTO>({
    resolver: zodResolver(CreateEducationInputSchema),
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

  const onSubmit = async (data: CreateEducationInputDTO) => {
    try {
      const cleanedData = {
        ...data,
        endDate: data.endDate?.trim() === "" ? undefined : data.endDate,
      };
      await addEducation(id, cleanedData);
      toast.success("Education added successfully");
      onEducationAdded();
      handleClose();
    } catch (err: unknown) {
      const parsed = handleApiError(err, "Failed to add education");
      toast.error(parsed.message);
      if (parsed.errors) {
        for (const [key, value] of Object.entries(parsed.errors)) {
          setError(key as keyof CreateEducationInputDTO, {
            type: "manual",
            message: value,
          });
        }
      }
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Add Education">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
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
          className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
        >
          Add Education
        </button>
      </form>
    </BaseModal>
  );
}
