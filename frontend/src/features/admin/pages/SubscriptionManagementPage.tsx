import { useEffect, useState } from "react";
import BaseModal from "../../user/componets/modals/BaseModal";
import {
  CreateSubscriptionPlan,
  DeleteSubscription,
  GetAllSubscription,
  TogglePlanStatus,
  UpdateSubscriptionPlan,
} from "../services/SubscriptionService";

interface Sub {
  _id: string;
  name: "BASIC" | "PRO" | "PREMIUM";
  price: number;
  validityDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

const SubscriptionManagementPage = () => {
  const [subscriptions, setSubscriptions] = useState<Sub[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Sub | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    validityDays: 0,
  });

  const fetchAllSub = async () => {
    try {
      setLoading(true);
      const res = await GetAllSubscription();
      const filtered = res.filter(
        (sub: any): sub is Sub =>
          sub.name === "BASIC" || sub.name === "PRO" || sub.name === "PREMIUM"
      );
      setSubscriptions(filtered);
    } catch (error) {
      console.error("Error fetching subscriptions", error);
      setFormError("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subId: string) => {
    if (!window.confirm("Are you sure you want to delete this subscription?")) {
      return;
    }

    try {
      setDeleteLoading(subId);
      await DeleteSubscription(subId);
      await fetchAllSub();
    } catch (error) {
      console.error("Error deleting subscription", error);
      setFormError("Failed to delete subscription");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleHide = async (subId: string, isActive: boolean) => {
    try {
      setToggleLoading(subId);
      await TogglePlanStatus(subId, !isActive);
      await fetchAllSub();
    } catch (error) {
      console.error("Error toggling subscription status", error);
      setFormError("Failed to update subscription status");
    } finally {
      setToggleLoading(null);
    }
  };

  const openAddModal = () => {
    setEditingSub(null);
    setFormError(null);
    setFieldErrors({});
    setFormData({ name: "", price: 0, validityDays: 0 });
    setModalOpen(true);
  };

  const openEditModal = (sub: Sub) => {
    setEditingSub(sub);
    setFormError(null);
    setFieldErrors({});
    setFormData({
      name: sub.name,
      price: sub.price,
      validityDays: sub.validityDays,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setFormError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      if (editingSub) {
        await UpdateSubscriptionPlan(editingSub._id, formData);
      } else {
        await CreateSubscriptionPlan(formData);
      }
      setModalOpen(false);
      await fetchAllSub();
    } catch (error: any) {
      if (error?.errors) {
        setFieldErrors(error.errors);
      } else if (error.message) {
        setFormError(error.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" ? value : parseInt(value) || 0,
    }));
  };

  useEffect(() => {
    fetchAllSub();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Subscription Management
        </h1>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
          onClick={openAddModal}
        >
          Add New Plan
        </button>
      </div>

      {formError && !modalOpen && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{formError}</p>
        </div>
      )}

      {loading && !modalOpen ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No subscription plans found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map((sub) => (
            <div
              key={sub._id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h2
                  className={`text-lg font-semibold ${
                    sub.name === "BASIC"
                      ? "text-blue-600"
                      : sub.name === "PRO"
                      ? "text-purple-600"
                      : "text-yellow-600"
                  }`}
                >
                  {sub.name}
                </h2>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    sub.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {sub.isActive ? "Active" : "Hidden"}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">₹{sub.price}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Validity:</span>
                  <span className="font-medium">{sub.validityDays} days</span>
                </p>
                <p className="flex justify-between text-sm text-gray-500">
                  <span>Created:</span>
                  <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                </p>
              </div>

              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  onClick={() => openEditModal(sub)}
                  disabled={
                    toggleLoading === sub._id || deleteLoading === sub._id
                  }
                >
                  Update
                </button>
                <button
                  className={`${
                    sub.isActive
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white px-3 py-1 rounded text-sm transition-colors`}
                  onClick={() => handleHide(sub._id, sub.isActive)}
                  disabled={
                    toggleLoading === sub._id || deleteLoading === sub._id
                  }
                >
                  {toggleLoading === sub._id
                    ? "Processing..."
                    : sub.isActive
                    ? "Hide"
                    : "Activate"}
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  onClick={() => handleDelete(sub._id)}
                  disabled={
                    toggleLoading === sub._id || deleteLoading === sub._id
                  }
                >
                  {deleteLoading === sub._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <BaseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingSub
            ? "Update Subscription Plan"
            : "Create New Subscription Plan"
        }
      >
        <div className="space-y-4">
          {formError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{formError}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan Name
            </label>
            <select
              name="name"
              className="border w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!!editingSub}
            >
              <option value="BASIC">BASIC</option>
              <option value="PRO">PRO</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              min="0"
              className="border w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.price}
              onChange={handleInputChange}
            />
            {fieldErrors.price && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validity (Days)
            </label>
            <input
              type="number"
              name="validityDays"
              min="1"
              className="border w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.validityDays}
              onChange={handleInputChange}
            />
            {fieldErrors.validityDays && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.validityDays}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : editingSub ? (
                "Update Plan"
              ) : (
                "Create Plan"
              )}
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default SubscriptionManagementPage;
