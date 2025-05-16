import React, { useState } from "react";
import { updateCompanyProfile } from "../../services/companyProfileService";
import { CompanyData } from "../../types/company";
import BaseModal from "./BaseModal";
import FormField from "../ui/FormField";
import toast from "react-hot-toast";
import { IndustryTypes } from "../../../../constants/industryTypes";

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: CompanyData;
  onSubmit: (updatedData: CompanyData) => void;
}

function EditCompanyModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: EditCompanyModalProps) {
  const [formData, setFormData] = useState<CompanyData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (field: keyof CompanyData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const currentYear = new Date().getFullYear();

    // Company Name validation
    if (!formData.companyName.trim()) {
      errors.companyName = "Company name is required";
    } else if (formData.companyName.length < 2) {
      errors.companyName = "Company name must be at least 2 characters long";
    } else if (formData.companyName.length > 100) {
      errors.companyName = "Company name cannot exceed 100 characters";
    }

    // Username validation
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_-]{3,30}$/.test(formData.username)) {
      errors.username =
        "Username must be 3-30 characters and can only contain letters, numbers, underscores, and hyphens";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Industry Type validation
    if (!formData.industryType) {
      errors.industryType = "Please select an industry type";
    } else if (!IndustryTypes.includes(formData.industryType)) {
      errors.industryType = "Invalid industry type selected";
    }

    // Founded Year validation
    if (formData.foundedYear) {
      const yearValue = Number(formData.foundedYear);
      if (isNaN(yearValue)) {
        errors.foundedYear = "Founded year must be a number";
      } else if (yearValue < 1800 || yearValue > currentYear) {
        errors.foundedYear = `Year must be between 1800 and ${currentYear}`;
      }
    }

    // Location validation
    if (formData.location && formData.location.length > 200) {
      errors.location = "Location cannot exceed 200 characters";
    }

    // About validation
    if (formData.about && formData.about.length > 2000) {
      errors.about = "Company description cannot exceed 2000 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the form");
      return;
    }

    setIsSubmitting(true);
    setGeneralError(null);

    try {
      const submissionData = {
        ...formData,
        foundedYear: formData.foundedYear
          ? Number(formData.foundedYear)
          : undefined,
      };

      const response = await updateCompanyProfile(submissionData);

      if (response) {
        toast.success("Company profile updated successfully");
        onSubmit(formData);
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to update company profile:", error);

      if (error.response?.data?.errors) {
        const responseErrors = error.response.data.errors;
        const newFieldErrors: Record<string, string> = {};

        Object.entries(responseErrors).forEach(([key, value]) => {
          newFieldErrors[key] = value as string;
        });

        setFieldErrors(newFieldErrors);
      } else {
        setGeneralError(
          error.response?.data?.message || "Failed to update company profile"
        );
      }

      toast.error(
        error.response?.data?.message || "Failed to update company profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Company Profile">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {generalError && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm">
            {generalError}
          </div>
        )}

        <FormField
          label="Company Name"
          name="companyName"
          type="text"
          placeholder="Enter company name"
          value={formData.companyName}
          onChange={(e) => handleChange("companyName", e.target.value)}
          error={fieldErrors.companyName}
        />

        <FormField
          label="Username"
          name="username"
          type="text"
          placeholder="Enter username"
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          error={fieldErrors.username}
        />

        {/* <FormField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter company email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={fieldErrors.email}
          required
        /> */}

        <div className="flex flex-col gap-1">
          <label
            htmlFor="industryType"
            className="text-sm font-medium text-gray-700"
          >
            Industry Type
          </label>
          <select
            id="industryType"
            name="industryType"
            value={formData.industryType}
            onChange={(e) => handleChange("industryType", e.target.value)}
            className={`w-full p-2 border rounded-md ${
              fieldErrors.industryType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Industry</option>
            {IndustryTypes.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
          {fieldErrors.industryType && (
            <p className="text-sm text-red-600">{fieldErrors.industryType}</p>
          )}
        </div>

        <FormField
          label="Founded Year"
          name="foundedYear"
          type="number"
          placeholder="e.g. 2020"
          value={formData.foundedYear}
          onChange={(e) => handleChange("foundedYear", e.target.value)}
          error={fieldErrors.foundedYear}
          min={1800}
          max={new Date().getFullYear()}
        />

        <FormField
          label="Location"
          name="location"
          type="text"
          placeholder="Enter company location"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          error={fieldErrors.location}
        />

        <FormField
          label="About"
          name="about"
          type="textarea"
          placeholder="Tell us about your company"
          value={formData.about}
          onChange={(e) => handleChange("about", e.target.value)}
          error={fieldErrors.about}
          rows={5}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}

export default EditCompanyModal;
