import React, { useState, useEffect } from "react";
import { Feature, FeatureFormData } from "../../types/feature";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

interface FeatureFormProps {
  onSubmit: (formData: FeatureFormData) => Promise<void>;
  onClose: () => void;
  initialData?: Feature;
  isLoading: boolean;
  formError: string | null;
  fieldErrors: Record<string, string>;
}

const FeatureForm: React.FC<FeatureFormProps> = ({
  onSubmit,
  onClose,
  initialData,
  isLoading,
  formError,
  fieldErrors,
}) => {
  const [formData, setFormData] = useState<FeatureFormData>({
    name: initialData?.name || "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formError && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p className="font-medium">Error</p>
          <p>{formError}</p>
        </div>
      )}

      <div className="space-y-4">
        <Input
          type="text"
          label="Feature Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter feature name"
          error={fieldErrors.name}
          hint="Enter a descriptive name for the feature"
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button type="submit" variant="primary" isLoading={isLoading}>
          {initialData ? "Update Feature" : "Create Feature"}
        </Button>
      </div>
    </form>
  );
};

export default FeatureForm;
