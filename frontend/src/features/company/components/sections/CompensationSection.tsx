import React from "react";
import FormSection from "../form/FormSection";
import FormField from "../form/FormField";
import InputField from "../form/InputField";
import TagsInput from "../input/TagsInput";
import { JobFormState } from "../../hooks/useJobForm";
type SalaryFields = keyof JobFormState["salary"];
interface CompensationSectionProps {
  formState: JobFormState;
  errors: Record<string, string>;
  handleSalaryChange: (field: SalaryFields, value: string | boolean) => void;
  handleBenefitsChange: (benefits: string[]) => void;
}

const CompensationSection: React.FC<CompensationSectionProps> = ({
  formState,
  errors,
  handleSalaryChange,
  handleBenefitsChange,
}) => {
  return (
    <FormSection title="Compensation & Benefits">
      <div className="space-y-5">
        <FormField
          label="Salary Range"
          htmlFor="salary"
          required={false}
          error={errors["salary.min"] || errors["salary.max"]}
          helpText="Enter the salary range for this position"
        >
          <div className="flex gap-3 items-center">
            <div className="w-24">
              <InputField
                id="currency"
                name="currency"
                value={formState.salary.currency}
                onChange={(e) => handleSalaryChange("currency", e.target.value)}
                placeholder="USD"
                error={!!errors["salary.currency"]}
              />
            </div>

            <div className="flex-1">
              <InputField
                type="number"
                id="salaryMin"
                name="salaryMin"
                value={formState.salary.min}
                onChange={(e) => handleSalaryChange("min", e.target.value)}
                placeholder="Min"
                error={!!errors["salary.min"]}
              />
            </div>

            <span className="text-gray-400">—</span>

            <div className="flex-1">
              <InputField
                type="number"
                id="salaryMax"
                name="salaryMax"
                value={formState.salary.max}
                onChange={(e) => handleSalaryChange("max", e.target.value)}
                placeholder="Max"
                error={!!errors["salary.max"]}
              />
            </div>
          </div>
        </FormField>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="salaryVisible"
            checked={formState.salary.isVisibleToApplicants}
            onChange={(e) =>
              handleSalaryChange("isVisibleToApplicants", e.target.checked)
            }
            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-colors"
          />
          <label htmlFor="salaryVisible" className="text-sm text-gray-600">
            Show salary range to applicants
          </label>
        </div>

        <FormField
          label="Benefits"
          htmlFor="benefits"
          required={false}
          error={errors.benefits}
          helpText="Add the benefits offered with this position"
        >
          <TagsInput
            value={formState.benefits}
            onChange={handleBenefitsChange}
            placeholder="e.g. Health insurance, 401k, Flexible hours"
            error={!!errors.benefits}
          />
        </FormField>
      </div>
    </FormSection>
  );
};

export default CompensationSection;
