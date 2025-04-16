import { useState } from "react";
import BaseModal from "../../modals/BaseModal";
import { addEducation } from "../../../services/ProfileService";
import { useAppSelector } from "../../../../../hooks/useAppSelector";
import toast from "react-hot-toast";

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
  const [formData, setFormData] = useState({
    institutionName: "",
    degree: "",
    fieldOfStudy: "",
    grade: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
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
    switch (name) {
      case "institutionName":
        if (!value.trim()) error = "Institution name is required";
        else if (value.length < 2) error = "Must be at least 2 characters";
        break;
      case "degree":
        if (!value.trim()) error = "Degree is required";
        else if (value.length < 2) error = "Must be at least 2 characters";
        break;
      case "fieldOfStudy":
        if (!value.trim()) error = "Field of study is required";
        else if (value.length < 2) error = "Must be at least 2 characters";
        break;
      case "startDate":
        if (!value) error = "Start date is required";
        else if (new Date(value) > new Date())
          error = "Cannot be in the future";
        break;
      case "endDate":
        if (value && new Date(value) < new Date(formData.startDate)) {
          error = "Must be after start date";
        }
        break;
      case "grade":
        if (value && !/^[A-Za-z0-9./% -]+$/.test(value)) {
          error = "Invalid grade format";
        }
        break;
      case "description":
        if (value.length > 500) error = "Maximum 500 characters allowed";
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date();

    // Required fields
    if (!formData.institutionName.trim())
      newErrors.institutionName = "Institution name is required";
    if (!formData.degree.trim()) newErrors.degree = "Degree is required";
    if (!formData.fieldOfStudy.trim())
      newErrors.fieldOfStudy = "Field of study is required";
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
    }

    // Format validations
    if (formData.grade && !/^[A-Za-z0-9./% -]+$/.test(formData.grade)) {
      newErrors.grade = "Invalid grade format";
    }

    if (formData.description.length > 500) {
      newErrors.description = "Maximum 500 characters allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    try {
      await addEducation(id, formData);
      toast.success("Education added successfully");
      onEducationAdded();
      onClose();
      setFormData({
        institutionName: "",
        degree: "",
        fieldOfStudy: "",
        grade: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    } catch (error) {
      toast.error("Failed to add education");
      console.error("Submission error:", error);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add Education">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="institutionName"
            placeholder="Institution Name"
            value={formData.institutionName}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.institutionName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.institutionName}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="degree"
            placeholder="Degree"
            value={formData.degree}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.degree && (
            <p className="text-red-500 text-sm mt-1">{errors.degree}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="fieldOfStudy"
            placeholder="Field of Study"
            value={formData.fieldOfStudy}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.fieldOfStudy && (
            <p className="text-red-500 text-sm mt-1">{errors.fieldOfStudy}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="grade"
            placeholder="Grade (optional)"
            value={formData.grade}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.grade && (
            <p className="text-red-500 text-sm mt-1">{errors.grade}</p>
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
          className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
        >
          Add Education
        </button>
      </form>
    </BaseModal>
  );
}
