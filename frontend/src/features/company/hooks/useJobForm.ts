import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { CreateJobInput, JobService } from "../services/jobServices";
import { handleApiError } from "../../../utils/apiError";

export type JobFormState = Omit<
  CreateJobInput,
  "salary" | "applicationDeadline"
> & {
  salary: {
    currency: string;
    min: string;
    max: string;
    isVisibleToApplicants: boolean;
  };
  applicationDeadline: string;
};

export function useJobForm() {
  const [formState, setFormState] = useState<JobFormState>({
    title: "",
    location: "",
    jobType: "remote",
    employmentType: "full-time",
    experienceLevel: "entry",
    applicationDeadline: "",
    description: "",
    skillsRequired: [],
    benefits: [],
    salary: {
      currency: "INR",
      min: "",
      max: "",
      isVisibleToApplicants: true,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleSalaryChange = (
    field: keyof typeof formState.salary,
    value: string | boolean
  ) => {
    setFormState((prev) => ({
      ...prev,
      salary: { ...prev.salary, [field]: value },
    }));
    clearFieldError(`salary.${field}`);
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormState((prev) => ({ ...prev, skillsRequired: skills }));
    clearFieldError("skillsRequired");
  };

  const handleBenefitsChange = (benefits: string[]) => {
    setFormState((prev) => ({ ...prev, benefits }));
    clearFieldError("benefits");
  };

  const handleLocationSelect = (location: string) => {
    setFormState((prev) => ({ ...prev, location }));
    clearFieldError("location");
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formState.title.trim()) newErrors.title = "Job title is required";
    if (!formState.location.trim()) newErrors.location = "Location is required";
    if (!formState.jobType) newErrors.jobType = "Job type is required";
    if (!formState.employmentType)
      newErrors.employmentType = "Employment type is required";
    if (!formState.description.trim())
      newErrors.description = "Description is required";
    if (formState.skillsRequired.length === 0)
      newErrors.skillsRequired = "At least one skill is required";
    if (!formState.experienceLevel)
      newErrors.experienceLevel = "Experience level is required";

    const min = Number(formState.salary.min);
    const max = Number(formState.salary.max);

    if (formState.salary.currency !== "INR") {
      newErrors["salary.currency"] = "Only INR currency is supported";
    }

    if (!formState.salary.min) {
      newErrors["salary.min"] = "Minimum salary is required";
    } else if (isNaN(min) || min < 1 || min > 75) {
      newErrors["salary.min"] = "Minimum salary must be between 1 and 75 LPA";
    }

    if (!formState.salary.max) {
      newErrors["salary.max"] = "Maximum salary is required";
    } else if (isNaN(max) || max < 1 || max > 75) {
      newErrors["salary.max"] = "Maximum salary must be between 1 and 75 LPA";
    }

    if (!isNaN(min) && !isNaN(max) && min > max) {
      newErrors["salary.min"] = "Minimum salary cannot be greater than maximum";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent, onSuccess?: () => void) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData: CreateJobInput = {
        ...formState,
        salary: {
          currency: formState.salary.currency,
          min: Number(formState.salary.min),
          max: Number(formState.salary.max),
          isVisibleToApplicants: formState.salary.isVisibleToApplicants,
        },
        applicationDeadline: new Date(formState.applicationDeadline),
      };

      await JobService.createJob(formData);
      toast.success("Job created successfully!");
      onSuccess?.();
    } catch (err: unknown) {
      const parsed = handleApiError(err, "Failed to create job");
      toast.error(parsed.message);
      setErrors(parsed.errors ?? {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState,
    setFormState,
    errors,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSalaryChange,
    handleSkillsChange,
    handleBenefitsChange,
    handleSubmit,
    handleLocationSelect,
  };
}
