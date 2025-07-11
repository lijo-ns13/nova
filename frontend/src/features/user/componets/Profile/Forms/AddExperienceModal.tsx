import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseModal from "../../modals/BaseModal";
import { addExperience } from "../../../services/ProfileService";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import toast from "react-hot-toast";
import { LocationSearchInput } from "../../../../../components/input/LocationSearchInput";
import {
  CreateExperienceInputDTO,
  CreateExperienceInputSchema,
} from "../../../schema/experienceSchema";
import { handleApiError } from "../../../../../utils/apiError";

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExperienceAdded: () => void;
}

export default function AddExperienceModal({
  isOpen,
  onClose,
  onExperienceAdded,
}: AddExperienceModalProps) {
  const { id } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateExperienceInputDTO>({
    resolver: zodResolver(CreateExperienceInputSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: "",
    },
  });

  const currentlyWorking = watch("currentlyWorking");

  const onSubmit = async (data: CreateExperienceInputDTO) => {
    try {
      await addExperience(id, {
        ...data,
        endDate: data.currentlyWorking ? "" : data.endDate,
      });
      toast.success("Experience added successfully");
      onExperienceAdded();
      handleClose();
    } catch (err: unknown) {
      const parsed = handleApiError(err, "Failed to add experience");
      toast.error(parsed.message);
      if (parsed.errors) {
        for (const [key, message] of Object.entries(parsed.errors)) {
          setError(key as keyof CreateExperienceInputDTO, {
            type: "manual",
            message,
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
    <BaseModal isOpen={isOpen} onClose={handleClose} title="Add Experience">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-6"
      >
        {/* Title */}
        <div>
          <label htmlFor="title">Job Title*</label>
          <input
            id="title"
            {...register("title")}
            placeholder="e.g. Software Engineer"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company">Company Name*</label>
          <input
            id="company"
            {...register("company")}
            placeholder="e.g. Google"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">
              {errors.company.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location">Location*</label>
          <LocationSearchInput
            value={watch("location")}
            onChange={(val) =>
              setValue("location", val, { shouldValidate: true })
            }
            onSelect={(val) =>
              setValue("location", val, { shouldValidate: true })
            }
            apiKey={import.meta.env.VITE_LOCATIONIQ_APIKEY || ""}
            placeholder="Search for location"
            className="w-full"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate">Start Date*</label>
            <input
              type="date"
              id="startDate"
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
            <label htmlFor="endDate">
              {currentlyWorking ? "Currently Working" : "End Date*"}
            </label>
            {!currentlyWorking && (
              <input
                type="date"
                id="endDate"
                {...register("endDate")}
                className="w-full border px-3 py-2 rounded"
              />
            )}
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.endDate.message}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <input
                id="currentlyWorking"
                type="checkbox"
                {...register("currentlyWorking")}
                className="h-4 w-4"
              />
              <label htmlFor="currentlyWorking">I currently work here</label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            className="w-full border px-3 py-2 rounded"
            placeholder="Describe your work"
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Optional, max 1000 characters
              </p>
            )}
            <span className="text-sm text-gray-500">
              {watch("description")?.length || 0}/1000
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-70"
        >
          {isSubmitting ? "Adding..." : "Add Experience"}
        </button>
      </form>
    </BaseModal>
  );
}
