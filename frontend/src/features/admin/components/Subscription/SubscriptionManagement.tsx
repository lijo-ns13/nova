import React, { useEffect, useState } from "react";
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
import {
  SubscriptionPlanResponse,
  CreatePlanInput,
} from "../../types/subscription";

import Button from "../../../../components/ui/Button";
import BaseModal from "../../../user/componets/modals/BaseModal";
import ConfirmationModal from "../../../../components/ui/ConfirmationModal";
import { ParsedAPIError } from "../../../../types/api";

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<
    SubscriptionPlanResponse[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionPlanResponse | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setGlobalError(null);
      const data = await GetAllSubscription();
      const filtered = data.filter((plan) =>
        ["BASIC", "PRO", "PREMIUM"].includes(plan.name)
      );
      setSubscriptions(filtered);
    } catch (err) {
      const error = err as ParsedAPIError;
      setGlobalError(error.message || "Failed to load subscription plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const openFormModal = (sub?: SubscriptionPlanResponse) => {
    setSelectedSubscription(sub || null);
    setFormError(null);
    setFieldErrors({});
    setFormModalOpen(true);
  };

  const openDeleteModal = (sub: SubscriptionPlanResponse) => {
    setSelectedSubscription(sub);
    setDeleteModalOpen(true);
  };

  const handleSubmitForm = async (formData: CreatePlanInput) => {
    setFormError(null);
    setFieldErrors({});
    setSubmitLoading(true);
    try {
      if (selectedSubscription) {
        const res = await UpdateSubscriptionPlan(
          selectedSubscription.id,
          formData
        );
        const otherSub = subscriptions.filter(
          (sub) => sub.id != selectedSubscription.id
        );
        setSubscriptions([...otherSub, res]);
      } else {
        const res = await CreateSubscriptionPlan(formData);
        setSubscriptions([...subscriptions, res]);
      }
      setFormModalOpen(false);
    } catch (err) {
      const error = err as ParsedAPIError;
      if (error.errors) setFieldErrors(error.errors);
      else setFormError(error.message || "Something went wrong.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSubscription) return;
    try {
      setDeleteLoading(selectedSubscription.id);
      await DeleteSubscription(selectedSubscription.id);
      setDeleteModalOpen(false);
      setSubscriptions(
        subscriptions.filter((sub) => sub.id != selectedSubscription.id)
      );
    } catch (err) {
      const error = err as ParsedAPIError;
      setGlobalError(error.message || "Failed to delete subscription plan.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      setToggleLoading(id);
      await TogglePlanStatus(id, !isActive);
      await fetchSubscriptions();
    } catch (err) {
      const error = err as ParsedAPIError;
      setGlobalError(error.message || "Failed to update status.");
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
          onClick={() => openFormModal()}
        >
          Add New Plan
        </Button>
      </div>

      {/* Global Error */}
      {globalError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="ml-3 text-sm text-red-700">{globalError}</p>
          </div>
        </div>
      )}

      {/* Subscriptions */}
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
            icon={<PlusCircle size={16} />}
            onClick={() => openFormModal()}
          >
            Create Your First Plan
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onEdit={() => openFormModal(sub)}
              onDelete={() => openDeleteModal(sub)}
              onToggleStatus={handleToggleStatus}
              isToggleLoading={toggleLoading === sub.id}
              isDeleteLoading={deleteLoading === sub.id}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
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

      {/* Delete Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Subscription Plan"
        message={`Are you sure you want to delete the "${selectedSubscription?.name}" plan? This action cannot be undone.`}
        confirmButtonText="Delete Plan"
        confirmButtonVariant="danger"
        isLoading={!!deleteLoading}
      />
    </div>
  );
};

export default SubscriptionManagement;
