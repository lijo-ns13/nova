import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { JobService } from "../services/jobServices";

export interface JobFormState {
  title: string;
  location: string;
  jobType: string;
  employmentType: string;
  experienceLevel: string;
  applicationDeadline: string;
  description: string;
  skillsRequired: string[];
  benefits: string[];
  salary: {
    currency: string;
    min: string;
    max: string;
    isVisibleToApplicants: boolean;
  };
}

export function useJobForm() {
  const [formState, setFormState] = useState<JobFormState>({
    title: "",
    location: "",
    jobType: "",
    employmentType: "",
    experienceLevel: "",
    applicationDeadline: "",
    description: "",
    skillsRequired: [],
    benefits: [],
    salary: {
      currency: "USD",
      min: "",
      max: "",
      isVisibleToApplicants: true,
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user edits the field
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user makes a selection
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSalaryChange = (
    field: keyof typeof formState.salary,
    value: string | boolean
  ) => {
    setFormState((prev) => ({
      ...prev,
      salary: {
        ...prev.salary,
        [field]: value,
      },
    }));

    // Clear errors related to salary
    if (errors[`salary.${field}`]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[`salary.${field}`];
        return updated;
      });
    }
  };

  const handleSkillsChange = (skills: string[]) => {
    setFormState((prev) => ({
      ...prev,
      skillsRequired: skills,
    }));

    // Clear errors related to skills
    if (errors.skillsRequired) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.skillsRequired;
        return updated;
      });
    }
  };

  const handleBenefitsChange = (benefits: string[]) => {
    setFormState((prev) => ({
      ...prev,
      benefits: benefits,
    }));

    // Clear errors related to benefits
    if (errors.benefits) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.benefits;
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
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

    // Salary validation
    if (formState.salary.min && formState.salary.max) {
      const min = Number(formState.salary.min);
      const max = Number(formState.salary.max);
      if (min > max) {
        newErrors["salary.min"] =
          "Minimum salary cannot be greater than maximum";
      }
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
      // Format the data for submission
      const formData = {
        ...formState,
        salary: {
          ...formState.salary,
          min: formState.salary.min ? Number(formState.salary.min) : undefined,
          max: formState.salary.max ? Number(formState.salary.max) : undefined,
        },
      };

      await JobService.createJob(formData);
      onSuccess?.();
      toast.success("Job created successfully!");

      // Reset form or redirect
      // setFormState(initialState);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState,
    errors,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSalaryChange,
    handleSkillsChange,
    handleBenefitsChange,
    handleSubmit,
  };
}
