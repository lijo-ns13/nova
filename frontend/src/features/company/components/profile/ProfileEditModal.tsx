import React, { useState } from "react";
import { X } from "lucide-react";
import {
  CompanyProfile,
  IndustryType,
  ProfileUpdateInput,
} from "../../types/company.types";
import { updateCompanyProfile } from "../../services/companyProfileService";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import TextArea from "../../../../components/ui/TextArea";
import Select from "../../../../components/ui/Select";

interface ProfileEditModalProps {
  profile: CompanyProfile;
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate: (updatedProfile: CompanyProfile) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  profile,
  isOpen,
  onClose,
  onProfileUpdate,
}) => {
  const [formData, setFormData] = useState<ProfileUpdateInput>({
    companyName: profile.companyName,
    username: profile.username,
    about: profile.about || "",
    industryType: profile.industryType,
    foundedYear: profile.foundedYear,
    website: profile.website || "",
    location: profile.location,
    companySize: profile.companySize || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const industryOptions = [
    { value: "Technology", label: "Technology" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Finance", label: "Finance" },
    { value: "Education", label: "Education" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Retail", label: "Retail" },
    { value: "Services", label: "Services" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Transportation", label: "Transportation" },
    { value: "Construction", label: "Construction" },
    { value: "Agriculture", label: "Agriculture" },
    { value: "Energy", label: "Energy" },
    { value: "Other", label: "Other" },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle number inputs
    if (name === "foundedYear" || name === "companySize") {
      setFormData({
        ...formData,
        [name]: value === "" ? undefined : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName?.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.username?.trim()) {
      newErrors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    if (!formData.location?.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website =
        "Please enter a valid URL (starting with http:// or https://)";
    }

    if (
      formData.foundedYear !== undefined &&
      (formData.foundedYear < 1900 ||
        formData.foundedYear > new Date().getFullYear())
    ) {
      newErrors.foundedYear = `Year must be between 1900 and ${new Date().getFullYear()}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await updateCompanyProfile(formData);

      if (response.success && response.data) {
        onProfileUpdate(response.data);
        onClose();
      }
    } catch (err: any) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({
          form: err.message || "An error occurred while updating profile",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-lg font-medium text-gray-900">
            Edit Company Profile
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
            {errors.form && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                {errors.form}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="md:col-span-2">
                <Input
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName || ""}
                  onChange={handleChange}
                  error={errors.companyName}
                  required
                />
              </div>

              {/* Username */}
              <div>
                <Input
                  label="Username"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleChange}
                  error={errors.username}
                  hint="Letters, numbers, and underscores only"
                  required
                />
              </div>

              {/* Industry Type */}
              <div>
                <Select
                  label="Industry"
                  name="industryType"
                  value={formData.industryType || ""}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      industryType: value as IndustryType,
                    })
                  }
                  options={industryOptions}
                  error={errors.industryType}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <Input
                  label="Location"
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                  error={errors.location}
                  required
                />
              </div>

              {/* Founded Year */}
              <div>
                <Input
                  label="Founded Year"
                  name="foundedYear"
                  type="number"
                  min={1900}
                  max={new Date().getFullYear()}
                  value={formData.foundedYear?.toString() || ""}
                  onChange={handleChange}
                  error={errors.foundedYear}
                  required
                />
              </div>

              {/* Website */}
              <div>
                <Input
                  label="Website"
                  name="website"
                  type="url"
                  value={formData.website || ""}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  error={errors.website}
                />
              </div>

              {/* Company Size */}
              <div>
                <Input
                  label="Company Size (employees)"
                  name="companySize"
                  type="number"
                  min={1}
                  value={formData.companySize?.toString() || ""}
                  onChange={handleChange}
                  error={errors.companySize}
                />
              </div>

              {/* About */}
              <div className="md:col-span-2">
                <TextArea
                  label="About"
                  name="about"
                  value={formData.about || ""}
                  onChange={handleChange}
                  rows={4}
                  error={errors.about}
                  placeholder="Write a short description about your company..."
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 sticky bottom-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;
