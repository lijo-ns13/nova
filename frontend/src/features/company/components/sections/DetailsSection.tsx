import React from "react";
import FormSection from "../form/FormSection";
import FormField from "../form/FormField";
import TextAreaField from "../form/TextAreaField";
import SkillsInput from "../Job/SkillsInput";
import { JobFormState } from "../../hooks/useJobForm";

interface DetailsSectionProps {
  formState: JobFormState;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSkillsChange: (skills: string[]) => void;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({
  formState,
  errors,
  handleInputChange,
  handleSkillsChange,
}) => {
  return (
    <FormSection title="Job Details">
      <FormField
        label="Description"
        htmlFor="description"
        error={errors.description}
      >
        <TextAreaField
          id="description"
          name="description"
          value={formState.description}
          onChange={handleInputChange}
          placeholder="Provide a detailed description of the role, responsibilities, and requirements..."
          rows={5}
          error={!!errors.description}
        />
      </FormField>

      <FormField
        label="Required Skills"
        htmlFor="skills"
        error={errors.skillsRequired}
        helpText="Add all skills required for this position"
      >
        <SkillsInput
          value={formState.skillsRequired}
          onChange={handleSkillsChange}
          error={!!errors.skillsRequired}
        />
      </FormField>
    </FormSection>
  );
};

export default DetailsSection;
