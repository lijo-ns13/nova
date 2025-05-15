import React from "react";
import FormSection from "../form/FormSection";
import FormField from "../form/FormField";
import InputField from "../form/InputField";
import SelectField from "../form/SelectField";
import { JobFormState } from "../../hooks/useJobForm";

interface BasicInfoSectionProps {
  formState: JobFormState;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const jobTypeOptions = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on-site", label: "On-site" },
];

const employmentTypeOptions = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "internship", label: "Internship" },
];

const experienceLevelOptions = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
];

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formState,
  errors,
  handleInputChange,
  handleSelectChange,
}) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <FormSection title="Basic Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          label="Job Title"
          htmlFor="title"
          error={errors.title}
          className="md:col-span-2"
        >
          <InputField
            id="title"
            name="title"
            value={formState.title}
            onChange={handleInputChange}
            placeholder="e.g. Senior React Developer"
            error={!!errors.title}
          />
        </FormField>

        <FormField label="Location" htmlFor="location" error={errors.location}>
          <InputField
            id="location"
            name="location"
            value={formState.location}
            onChange={handleInputChange}
            placeholder="e.g. New York, NY or Remote"
            error={!!errors.location}
          />
        </FormField>

        <FormField label="Job Type" htmlFor="jobType" error={errors.jobType}>
          <SelectField
            id="jobType"
            name="jobType"
            value={formState.jobType}
            onChange={handleSelectChange}
            options={jobTypeOptions}
            placeholder="Select Job Type"
            error={!!errors.jobType}
          />
        </FormField>

        <FormField
          label="Employment Type"
          htmlFor="employmentType"
          error={errors.employmentType}
        >
          <SelectField
            id="employmentType"
            name="employmentType"
            value={formState.employmentType}
            onChange={handleSelectChange}
            options={employmentTypeOptions}
            placeholder="Select Employment Type"
            error={!!errors.employmentType}
          />
        </FormField>

        <FormField
          label="Experience Level"
          htmlFor="experienceLevel"
          error={errors.experienceLevel}
        >
          <SelectField
            id="experienceLevel"
            name="experienceLevel"
            value={formState.experienceLevel}
            onChange={handleSelectChange}
            options={experienceLevelOptions}
            placeholder="Select Experience Level"
            error={!!errors.experienceLevel}
          />
        </FormField>

        <FormField
          label="Application Deadline"
          htmlFor="applicationDeadline"
          error={errors.applicationDeadline}
        >
          <InputField
            type="date"
            id="applicationDeadline"
            name="applicationDeadline"
            value={formState.applicationDeadline}
            onChange={handleInputChange}
            min={today}
            error={!!errors.applicationDeadline}
          />
        </FormField>
      </div>
    </FormSection>
  );
};

export default BasicInfoSection;
