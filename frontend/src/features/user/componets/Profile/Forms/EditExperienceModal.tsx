import { useState, useEffect } from "react";
import BaseModal from "../../modals/BaseModal";
import { editExperience } from "../../../services/ProfileService";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import toast from "react-hot-toast";

interface EditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: any;
  onExperienceUpdated: () => void;
}

export default function EditExperienceModal({
  isOpen,
  onClose,
  experience,
  onExperienceUpdated,
}: EditExperienceModalProps) {
  const { id } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (experience) {
      setFormData({
        title: experience.title,
        company: experience.company,
        location: experience.location,
        startDate: experience.startDate.split("T")[0],
        endDate: experience.endDate?.split("T")[0] || "",
        description: experience.description,
      });
    }
  }, [experience]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    const today = new Date();

    switch (name) {
      case "title":
        if (!value.trim()) error = "Job title is required";
        else if (value.length < 2) error = "Must be at least 2 characters";
        break;
      case "company":
        if (!value.trim()) error = "Company name is required";
        else if (value.length < 2) error = "Must be at least 2 characters";
        break;
      case "location":
        if (value && value.length < 2) error = "Must be at least 2 characters";
        break;
      case "startDate":
        if (!value) error = "Start date is required";
        else if (new Date(value) > today) error = "Cannot be in the future";
        break;
      case "endDate":
        if (value) {
          const startDate = new Date(formData.startDate);
          const endDate = new Date(value);
          if (endDate < startDate) error = "Must be after start date";
          if (endDate > today) error = "Cannot be in the future";
        }
        break;
      case "description":
        if (value.length > 1000) error = "Maximum 1000 characters allowed";
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date();

    // Required fields
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.company.trim())
      newErrors.company = "Company name is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";

    // Date validations
    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      if (startDate > today) newErrors.startDate = "Cannot be in the future";
    }

    if (formData.endDate) {
      const endDate = new Date(formData.endDate);
      const startDate = new Date(formData.startDate);
      if (endDate < startDate) newErrors.endDate = "Must be after start date";
      if (endDate > today) newErrors.endDate = "Cannot be in the future";
    }

    // Location validation
    if (formData.location && formData.location.length < 2) {
      newErrors.location = "Must be at least 2 characters";
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

    try {
      await editExperience(id, experience._id, formData);
      toast.success("Experience updated successfully");
      onExperienceUpdated();
      onClose();
    } catch (error) {
      toast.error("Failed to update experience");
      console.error("Submission error:", error);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Experience">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.company && (
            <p className="text-red-500 text-sm mt-1">{errors.company}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        <div>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        <div>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
          )}
        </div>

        <div>
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border px-3 py-2 rounded"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
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
