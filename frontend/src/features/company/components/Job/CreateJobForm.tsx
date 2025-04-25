import React, { FormEvent, useState } from "react";
import clsx from "clsx";
import { createJobSchema } from "../../util/jobValidtors";
import { JobService } from "../../services/jobServices";
import toast from "react-hot-toast";

interface Props {
  onSuccess?: () => void;
}
// Move these outside CreateJobForm
const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const FormField = ({
  label,
  required = true,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);
const CreateJobForm: React.FC<Props> = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [description, setDescription] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState("");
  const [salary, setSalary] = useState({
    currency: "USD",
    min: "",
    max: "",
    isVisibleToApplicants: true,
  });
  const [benefits, setBenefits] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSalaryChange = (
    field: keyof typeof salary,
    value: string | boolean
  ) => {
    setSalary((prev) => ({ ...prev, [field]: value }));
  };
  const fetchSkills = async (query: string) => {
    const res = await fetch(`/skills?query=${query}`);

    return res.json();
  };
  const handleSubmit = async (e: FormEvent) => {
    console.log("clikced");
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      title,
      location,
      jobType,
      employmentType,
      description,
      skillsRequired: skillsRequired.split(",").map((skill) => skill.trim()),
      salary: {
        currency: salary.currency,
        isVisibleToApplicants: salary.isVisibleToApplicants,
        min: Number(salary.min),
        max: Number(salary.max),
      },
      benefits: benefits.split(",").map((benefit) => benefit.trim()),
      experienceLevel,
      applicationDeadline: applicationDeadline,
    };
    console.log("formData", formData);
    try {
      const validationResult = createJobSchema.safeParse(formData);
      console.log("validationResult", validationResult);
      if (!validationResult.success) {
        const newErrors = validationResult.error.errors.reduce((acc, curr) => {
          const key = curr.path.join(".");
          acc[key] = curr.message;
          return acc;
        }, {} as Record<string, string>);

        setErrors(newErrors);
        return;
      }

      await JobService.createJob(formData);
      toast.success("Job created successfully!");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (hasError: boolean) =>
    clsx(
      "w-full border rounded-md px-3 py-2 focus:ring-2 focus:outline-none",
      hasError
        ? "border-red-300 focus:ring-red-500"
        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
    );

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
        <h1 className="text-2xl font-bold">Create Job Posting</h1>
        <p className="mt-1 text-blue-100">
          Fill in the details to create a new job opportunity
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <FormSection title="Basic Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Job Title" error={errors.title}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior React Developer"
                className={inputClasses(!!errors.title)}
              />
            </FormField>

            <FormField label="Location" error={errors.location}>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="New York, NY or Remote"
                className={inputClasses(!!errors.location)}
              />
            </FormField>

            <FormField label="Job Type" error={errors.jobType}>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className={inputClasses(!!errors.jobType)}
              >
                <option value="">Select Job Type</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-site</option>
              </select>
            </FormField>
            <FormField label="Experience Level" error={errors.experienceLevel}>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className={inputClasses(!!errors.experienceLevel)}
              >
                <option value="">Select Experience Level</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </FormField>
            <FormField label="Employment Type" error={errors.employmentType}>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className={inputClasses(!!errors.employmentType)}
              >
                <option value="">Select Employment Type</option>
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
                <option value="internship">Internship</option>
              </select>
            </FormField>
            <FormField
              label="Application Deadline"
              error={errors.applicationDeadline}
            >
              <input
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                className={inputClasses(!!errors.applicationDeadline)}
                min={new Date().toISOString().split("T")[0]} // Set min date to today
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Details">
          <FormField label="Description" error={errors.description}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={inputClasses(!!errors.description)}
              placeholder="Detailed job description..."
            />
          </FormField>

          <FormField label="Required Skills" error={errors.skillsRequired}>
            <input
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              placeholder="e.g. React, TypeScript, Node.js"
              className={inputClasses(!!errors.skillsRequired)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate skills with commas. Example:{" "}
              <span className="italic">React, TypeScript, Node.js</span>
            </p>
          </FormField>
        </FormSection>

        <FormSection title="Compensation & Benefits">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <FormField label="Salary Range" error={errors["salary.max"]}>
                <div className="flex gap-2">
                  <input
                    value={salary.currency}
                    onChange={(e) =>
                      handleSalaryChange("currency", e.target.value)
                    }
                    placeholder="USD"
                    className={clsx(
                      inputClasses(!!errors["salary.currency"]),
                      "w-20"
                    )}
                  />
                  <input
                    type="number"
                    value={salary.min}
                    onChange={(e) => handleSalaryChange("min", e.target.value)}
                    placeholder="Min"
                    className={inputClasses(!!errors["salary.min"])}
                  />
                  <input
                    type="number"
                    value={salary.max}
                    onChange={(e) => handleSalaryChange("max", e.target.value)}
                    placeholder="Max"
                    className={inputClasses(!!errors["salary.max"])}
                  />
                </div>
              </FormField>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="salaryVisible"
                  checked={salary.isVisibleToApplicants}
                  onChange={(e) =>
                    handleSalaryChange(
                      "isVisibleToApplicants",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="salaryVisible"
                  className="text-sm text-gray-600"
                >
                  Show salary to applicants
                </label>
              </div>
            </div>

            <FormField label="Benefits" error={errors.benefits}>
              <input
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="e.g. Health insurance, 401k, Paid Time Off"
                className={inputClasses(!!errors.benefits)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Separate benefits with commas. Example:{" "}
                <span className="italic">
                  Health insurance, 401k, Paid Time Off
                </span>
              </p>
            </FormField>
          </div>
        </FormSection>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
          >
            {isSubmitting && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="opacity-25"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {isSubmitting ? "Submitting..." : "Create Job"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobForm;
