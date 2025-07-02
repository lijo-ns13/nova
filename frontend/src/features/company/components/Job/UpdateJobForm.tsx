import React from "react";
import FormContainer from "../Job/update/FormContainer";
import BasicInfoSection from "../sections/BasicInfoSection";
import DetailsSection from "../sections/DetailsSection";
import CompensationSection from "../sections/CompensationSection";
import FormButtons from "../Job/update/FormButtons";
import { useUpdateJobForm } from "../../hooks/useUpdateJobForm";

interface UpdateJobFormProps {
  jobId: string;
  onSuccess?: () => void;
}

const UpdateJobForm: React.FC<UpdateJobFormProps> = ({ jobId, onSuccess }) => {
  const {
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
    handleLocationSelect,
  } = useUpdateJobForm({
    jobId,
    onSuccess: () => {
      // Call the onSuccess callback to trigger UI refresh
      onSuccess?.();
    },
  });

  if (isLoading) {
    return (
      <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading job data...</p>
      </div>
    );
  }

  return (
    <FormContainer
      title="Update Job Posting"
      subtitle="Update the details to modify this job opportunity"
    >
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
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

        <FormButtons
          isSubmitting={isSubmitting}
          submitText="Update Job"
          loadingText="Updating..."
        />
      </form>
    </FormContainer>
  );
};

export default UpdateJobForm;
