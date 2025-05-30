import React, { useState, useEffect } from "react";
import { Subscription, SubscriptionFormData } from "../../types/subscription";

import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import SelectSub from "../../../../components/ui/SelectSub";

interface SubscriptionFormProps {
  onSubmit: (formData: SubscriptionFormData) => Promise<void>;
  onClose: () => void;
  initialData?: Subscription;
  isLoading: boolean;
  formError: string | null;
  fieldErrors: Record<string, string>;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  onSubmit,
  onClose,
  initialData,
  isLoading,
  formError,
  fieldErrors,
}) => {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    name: initialData?.name || "BASIC",
    price: initialData?.price || NaN,
    validityDays: initialData?.validityDays || NaN,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        validityDays: initialData.validityDays,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" ? value : parseInt(value) || 0,
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
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
        <SelectSub
          label="Plan Name"
          name="name"
          options={[
            { value: "BASIC", label: "BASIC" },
            { value: "PRO", label: "PRO" },
            { value: "PREMIUM", label: "PREMIUM" },
          ]}
          value={formData.name}
          onChange={handleSelectChange("name")}
          disabled={!!initialData}
          error={fieldErrors.name}
          hint="Select the subscription tier"
        />

        <Input
          type="number"
          label="Price (₹)"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min={0}
          placeholder="Enter price in rupees"
          error={fieldErrors.price}
          hint="Set the subscription price"
        />

        <Input
          type="number"
          label="Validity (Days)"
          name="validityDays"
          value={formData.validityDays}
          onChange={handleChange}
          min={1}
          placeholder="Enter validity period in days"
          error={fieldErrors.validityDays}
          hint="Set how many days the subscription will be valid"
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
          {initialData ? "Update Plan" : "Create Plan"}
        </Button>
      </div>
    </form>
  );
};

export default SubscriptionForm;
