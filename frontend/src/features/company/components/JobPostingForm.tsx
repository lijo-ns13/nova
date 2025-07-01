import React from "react";
import FormContainer from "./form/FormContainer";
import BasicInfoSection from "./sections/BasicInfoSection";
import DetailsSection from "./sections/DetailsSection";
import CompensationSection from "./sections/CompensationSection";
import FormButtons from "./form/FormButtons";
import { useJobForm } from "../hooks/useJobForm";

interface JobPostingFormProps {
  onSuccess?: () => void;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ onSuccess }) => {
  const {
    formState,
    errors,
    isSubmitting,
    setFormState,
    handleInputChange,
    handleSelectChange,
    handleSalaryChange,
    handleSkillsChange,
    handleBenefitsChange,
    handleSubmit,
    handleLocationSelect,
  } = useJobForm();
  console.log("formSTate", formState);

  return (
    <FormContainer
      title="Create Job Posting"
      subtitle="Fill in the details to create a compelling job opportunity"
    >
      <form onSubmit={(e) => handleSubmit(e, onSuccess)} className="space-y-8">
        <BasicInfoSection
          formState={formState}
          errors={errors}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleLocationSelect={handleLocationSelect} // Pass the location handler
        />

        <DetailsSection
          formState={formState}
          errors={errors}
          handleInputChange={handleInputChange}
          handleSkillsChange={handleSkillsChange}
        />

        <CompensationSection
          formState={formState}
          errors={errors}
          handleSalaryChange={handleSalaryChange}
          handleBenefitsChange={handleBenefitsChange}
        />

        <FormButtons isSubmitting={isSubmitting} />
      </form>
    </FormContainer>
  );
};

export default JobPostingForm;
