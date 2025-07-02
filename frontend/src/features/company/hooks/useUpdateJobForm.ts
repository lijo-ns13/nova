import { useState, FormEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { JobService } from "../services/jobServices";
import { JobFormState } from "./useJobForm";

interface UseUpdateJobFormProps {
  jobId: string;
  onSuccess?: () => void;
}

export function useUpdateJobForm({ jobId, onSuccess }: UseUpdateJobFormProps) {
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (jobId) {
      loadJobData();
    }
  }, [jobId]);

  const loadJobData = async () => {
    try {
      setIsLoading(true);
      const { success, job } = await JobService.getJob(jobId);

      if (!success || !job?.length) {
        toast.error("Failed to load job data");
        return;
      }

      const jobData = job[0];

      setFormState({
        title: jobData.title || "",
        location: jobData.location || "",
        jobType: jobData.jobType || "",
        employmentType: jobData.employmentType || "",
        experienceLevel: jobData.experienceLevel || "",
        applicationDeadline: jobData.applicationDeadline
          ? jobData.applicationDeadline.split("T")[0]
          : "",
        description: jobData.description || "",
        skillsRequired:
          jobData.skillsRequired?.map((skill: any) =>
            typeof skill === "string" ? skill : skill.title
          ) || [],
        benefits: jobData.benefits || [],
        salary: {
          currency: jobData.salary?.currency || "USD",
          min: jobData.salary?.min?.toString() || "",
          max: jobData.salary?.max?.toString() || "",
          isVisibleToApplicants:
            jobData.salary?.isVisibleToApplicants !== undefined
              ? jobData.salary.isVisibleToApplicants
              : true,
        },
      });
    } catch (error) {
      console.error("Error loading job data:", error);
      toast.error("Failed to load job data");
    } finally {
      setIsLoading(false);
    }
  };
const handleLocationSelect = (location: string) => {
    setFormState((prev) => ({
      ...prev,
      location,
    }));

    // Clear location error if any
    if (errors.location) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.location;
        return updated;
      });
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = {
        ...formState,
        salary: {
          ...formState.salary,
          min: formState.salary.min ? Number(formState.salary.min) : undefined,
          max: formState.salary.max ? Number(formState.salary.max) : undefined,
        },
      };

      await JobService.updateJob(jobId, formData);
      toast.success("Job updated successfully!");

      // Call the onSuccess callback after successful update
      onSuccess?.();
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formState,
    errors,
    isSubmitting,
    isLoading,
    handleInputChange,
    handleSelectChange,
    handleSalaryChange,
    handleSkillsChange,
    handleBenefitsChange,
    handleSubmit,
    handleLocationSelect
  };
}
