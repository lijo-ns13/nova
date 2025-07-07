import React, { useEffect, useState } from "react";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import SelectSub from "../../../../components/ui/SelectSub";

import type {
  SubscriptionPlanResponse,
  CreatePlanInput,
} from "../../types/subscription";

type SubscriptionFormData = CreatePlanInput;

interface SubscriptionFormProps {
  onSubmit: (formData: SubscriptionFormData) => Promise<void>;
  onClose: () => void;
  initialData?: Pick<
    SubscriptionPlanResponse,
    "name" | "price" | "validityDays"
  >;
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
    price: initialData?.price ?? 0,
    validityDays: initialData?.validityDays ?? 1,
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

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value as SubscriptionFormData["name"],
      }));
    } else {
      const parsed = Number(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(parsed) ? 0 : parsed,
      }));
    }
  };

  const handleSelectChange =
    (name: keyof SubscriptionFormData) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value as SubscriptionFormData["name"],
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Unexpected form submission error:", err);
    }
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
          disabled={!!initialData} // lock name on update
          error={fieldErrors.name}
          hint="Select the subscription tier"
        />

        <Input
          type="number"
          label="Price (₹)"
          name="price"
          value={formData.price}
          onChange={handleChange}
          // min={0}
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
          // min={1}
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
