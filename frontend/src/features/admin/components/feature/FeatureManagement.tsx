import React, { useState, useEffect } from "react";
import {
  createFeature,
  deleteFeature,
  getAllFeatures,
  updateFeature,
} from "../../services/FeatureService";
import FeatureCard from "./FeatureCard";
import FeatureForm from "./FeatureForm";
import { Feature, FeatureFormData } from "../../types/feature";

import { PlusCircle, AlertTriangle, Loader2 } from "lucide-react";
import Button from "../../../../components/ui/Button";
import BaseModal from "../../../company/components/profile/BaseModal";
import ConfirmationModal from "../../../../components/ui/ConfirmationModal";

const FeatureManagement: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      setGlobalError(null);
      const data = await getAllFeatures();
      setFeatures(data);
    } catch (error) {
      console.error("Error fetching features", error);
      setGlobalError("Failed to load features. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleOpenFormModal = (feature?: Feature) => {
    setSelectedFeature(feature || null);
    setFormError(null);
    setFieldErrors({});
    setFormModalOpen(true);
  };

  const handleOpenDeleteModal = (feature: Feature) => {
    setSelectedFeature(feature);
    setDeleteModalOpen(true);
  };

  const handleSubmitForm = async (formData: FeatureFormData) => {
    setFormError(null);
    setFieldErrors({});
    setSubmitLoading(true);

    try {
      if (selectedFeature) {
        await updateFeature(selectedFeature._id, formData);
      } else {
        await createFeature(formData);
      }
      setFormModalOpen(false);
      await fetchFeatures();
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null) {
        const errObj = error as {
          errors?: Record<string, string>;
          message?: string;
        };

        if (errObj.errors) {
          setFieldErrors(errObj.errors);
        } else if (errObj.message) {
          setFormError(errObj.message);
        } else {
          setFormError("An unexpected error occurred. Please try again.");
        }
      } else {
        setFormError("An unknown error occurred.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedFeature) return;

    try {
      setDeleteLoading(selectedFeature._id);
      await deleteFeature(selectedFeature._id);
      setDeleteModalOpen(false);
      await fetchFeatures();
    } catch (error) {
      console.error("Error deleting feature", error);
      setGlobalError("Failed to delete the feature.");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Feature Management
          </h2>
          <p className="mt-1 text-gray-500">Manage your application features</p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<PlusCircle size={18} />}
          onClick={() => handleOpenFormModal()}
        >
          Add New Feature
        </Button>
      </div>

      {/* Global Error */}
      {globalError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{globalError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Feature Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-teal-500 animate-spin mb-4" />
          <p className="text-gray-500">Loading features...</p>
        </div>
      ) : features.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">No features found</p>
          <Button
            variant="outline"
            onClick={() => handleOpenFormModal()}
            icon={<PlusCircle size={16} />}
          >
            Create Your First Feature
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature._id}
              feature={feature}
              onEdit={() => handleOpenFormModal(feature)}
              onDelete={() => handleOpenDeleteModal(feature)}
              isDeleteLoading={deleteLoading === feature._id}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <BaseModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={selectedFeature ? "Update Feature" : "Create New Feature"}
      >
        <FeatureForm
          onSubmit={handleSubmitForm}
          onClose={() => setFormModalOpen(false)}
          initialData={selectedFeature || undefined}
          isLoading={submitLoading}
          formError={formError}
          fieldErrors={fieldErrors}
        />
      </BaseModal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Feature"
        message={`Are you sure you want to delete the feature "${selectedFeature?.name}"? This action cannot be undone.`}
        confirmButtonText="Delete Feature"
        confirmButtonVariant="danger"
        isLoading={!!deleteLoading}
      />
    </div>
  );
};

export default FeatureManagement;
