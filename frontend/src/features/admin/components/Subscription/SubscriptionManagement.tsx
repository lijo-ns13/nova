import React, { useState, useEffect } from "react";

import {
  CreateSubscriptionPlan,
  DeleteSubscription,
  GetAllSubscription,
  TogglePlanStatus,
  UpdateSubscriptionPlan,
} from "../../services/SubscriptionService";
import SubscriptionCard from "./SubscriptionCard";

import SubscriptionForm from "./SubscriptionForm";

import { PlusCircle, AlertTriangle, Loader2 } from "lucide-react";
import { Subscription, SubscriptionFormData } from "../../types/subscription";
import Button from "../../../../components/ui/Button";
import BaseModal from "../../../user/componets/modals/BaseModal";
import ConfirmationModal from "../../../../components/ui/ConfirmationModal";
interface ApiError {
  errors?: Record<string, string>;
  message?: string;
}
const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Fetch all subscriptions
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setGlobalError(null);
      const data = await GetAllSubscription();
      const filteredSubscriptions = data.filter(
        (sub): sub is Subscription =>
          sub.name === "BASIC" || sub.name === "PRO" || sub.name === "PREMIUM"
      );
      setSubscriptions(filteredSubscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions", error);
      setGlobalError("Failed to load subscription plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Handle opening the add/edit modal
  const handleOpenFormModal = (subscription?: Subscription) => {
    setSelectedSubscription(subscription || null);
    setFormError(null);
    setFieldErrors({});
    setFormModalOpen(true);
  };

  // Handle opening the delete confirmation modal
  const handleOpenDeleteModal = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setDeleteModalOpen(true);
  };

  // Handle form submission for create/update
  const handleSubmitForm = async (formData: SubscriptionFormData) => {
    setFormError(null);
    setFieldErrors({});
    setSubmitLoading(true);

    try {
      if (selectedSubscription) {
        await UpdateSubscriptionPlan(selectedSubscription._id, formData);
      } else {
        await CreateSubscriptionPlan(formData);
      }
      setFormModalOpen(false);
      await fetchSubscriptions();
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError?.errors) {
        setFieldErrors(apiError.errors);
      } else if (apiError.message) {
        setFormError(apiError.message);
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!selectedSubscription) return;

    try {
      setDeleteLoading(selectedSubscription._id);
      await DeleteSubscription(selectedSubscription._id);
      setDeleteModalOpen(false);
      await fetchSubscriptions();
    } catch (error) {
      console.error("Error deleting subscription", error);
      setGlobalError("Failed to delete the subscription plan.");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle toggling subscription status
  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      setToggleLoading(id);
      await TogglePlanStatus(id, !isActive);
      await fetchSubscriptions();
    } catch (error) {
      console.error("Error toggling subscription status", error);
      setGlobalError("Failed to update subscription status.");
    } finally {
      setToggleLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Subscription Plans
          </h1>
          <p className="mt-1 text-gray-500">
            Manage your subscription offerings
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<PlusCircle size={18} />}
          onClick={() => handleOpenFormModal()}
        >
          Add New Plan
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

      {/* Subscription Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500">Loading subscription plans...</p>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 mb-4">No subscription plans found</p>
          <Button
            variant="outline"
            onClick={() => handleOpenFormModal()}
            icon={<PlusCircle size={16} />}
          >
            Create Your First Plan
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription._id}
              subscription={subscription}
              onEdit={() => handleOpenFormModal(subscription)}
              onDelete={() => handleOpenDeleteModal(subscription)}
              onToggleStatus={handleToggleStatus}
              isToggleLoading={toggleLoading === subscription._id}
              isDeleteLoading={deleteLoading === subscription._id}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <BaseModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={
          selectedSubscription
            ? "Update Subscription Plan"
            : "Create New Subscription Plan"
        }
      >
        <SubscriptionForm
          onSubmit={handleSubmitForm}
          onClose={() => setFormModalOpen(false)}
          initialData={selectedSubscription || undefined}
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
        title="Delete Subscription Plan"
        message={`Are you sure you want to delete the ${selectedSubscription?.name} plan? This action cannot be undone.`}
        confirmButtonText="Delete Plan"
        confirmButtonVariant="danger"
        isLoading={!!deleteLoading}
      />
    </div>
  );
};

export default SubscriptionManagement;
