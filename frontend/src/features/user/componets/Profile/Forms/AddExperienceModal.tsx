import { useState } from "react";
import BaseModal from "../../modals/BaseModal";
import { addExperience } from "../../../services/ProfileService";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import toast from "react-hot-toast";
import { LocationSearchInput } from "../../../../../components/input/LocationSearchInput";

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
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    currentlyWorking: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLocationSelect = (location: string) => {
    setFormData((prev) => ({ ...prev, location }));
    // Clear location error if any
    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: "" }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const today = new Date();

    // Required fields validation
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.company.trim())
      newErrors.company = "Company name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";

    // Date validations
    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      if (startDate > today) newErrors.startDate = "Cannot be in the future";
    }

    if (!formData.currentlyWorking && formData.endDate) {
      const endDate = new Date(formData.endDate);
      const startDate = new Date(formData.startDate);
      if (endDate < startDate) newErrors.endDate = "Must be after start date";
      if (endDate > today) newErrors.endDate = "Cannot be in the future";
    }

    if (!formData.currentlyWorking && !formData.endDate) {
      newErrors.endDate = "End date is required unless currently working here";
    }

    // Description validation
    if (formData.description.length > 1000) {
      newErrors.description = "Maximum 1000 characters allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await addExperience(id, {
        ...formData,
        // Clear endDate if currently working
        endDate: formData.currentlyWorking ? "" : formData.endDate,
      });
      toast.success("Experience added successfully");
      onExperienceAdded();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add experience. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      currentlyWorking: false,
    });
    setErrors({});
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add Experience">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Job Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Job Title*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="e.g. Software Engineer"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none placeholder-gray-400 ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Company Name*
          </label>
          <input
            type="text"
            id="company"
            name="company"
            placeholder="e.g. Google"
            value={formData.company}
            onChange={handleChange}
            className={`w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none placeholder-gray-400 ${
              errors.company ? "border-red-500" : ""
            }`}
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company}</p>
          )}
        </div>

        {/* Location - Required with autocomplete */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location*
          </label>
          <LocationSearchInput
            onSelect={handleLocationSelect}
            apiKey={import.meta.env.VITE_LOCATIONIQ_APIKEY || ""}
            placeholder="Search for company location..."
            className={`w-full ${errors.location ? "border-red-500" : ""}`}
            initialValue={formData.location}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Date Fields - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Date*
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none ${
                errors.startDate ? "border-red-500" : ""
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>

          {/* End Date or Currently Working */}
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {formData.currentlyWorking ? "Currently Working" : "End Date*"}
            </label>
            {!formData.currentlyWorking && (
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.currentlyWorking}
                className={`w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none ${
                  errors.endDate ? "border-red-500" : ""
                }`}
              />
            )}
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="currentlyWorking"
                name="currentlyWorking"
                checked={formData.currentlyWorking}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="currentlyWorking"
                className="ml-2 block text-sm text-gray-700"
              >
                I currently work here
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your responsibilities and achievements"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 outline-none placeholder-gray-400 ${
              errors.description ? "border-red-500" : ""
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-sm text-red-600">{errors.description}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Optional, max 1000 characters
              </p>
            )}
            <span className="text-sm text-gray-500">
              {formData.description.length}/1000
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Adding..." : "Add Experience"}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
