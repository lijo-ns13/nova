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

  const [formData, setFormData] = useState({
    name: "BASIC",
    price: 0,
    validityDays: 0,
  });

  const fetchAllSub = async () => {
    try {
      const res = await GetAllSubscription();
      const filtered = res.filter(
        (sub: any): sub is Sub =>
          sub.name === "BASIC" || sub.name === "PRO" || sub.name === "PREMIUM"
      );
      setSubscriptions(filtered);
    } catch (error) {
      console.error("Error fetching subscriptions", error);
    }
  };

  const handleDelete = async (subId: string) => {
    await DeleteSubscription(subId);
    fetchAllSub();
  };

  const handleHide = async (subId: string, isActive: boolean) => {
    await TogglePlanStatus(subId, !isActive);
    fetchAllSub();
  };

  const openAddModal = () => {
    setEditingSub(null);
    setFormData({ name: "BASIC", price: 0, validityDays: 0 });
    setModalOpen(true);
  };

  const openEditModal = (sub: Sub) => {
    setEditingSub(sub);
    setFormData({
      name: sub.name,
      price: sub.price,
      validityDays: sub.validityDays,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (editingSub) {
      await UpdateSubscriptionPlan(editingSub._id, formData);
    } else {
      await CreateSubscriptionPlan(formData);
    }
    setModalOpen(false);
    fetchAllSub();
  };

  useEffect(() => {
    fetchAllSub();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Subscription Management</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={openAddModal}
        >
          Add New
        </button>
      </div>

      {subscriptions.map((sub) => (
        <div key={sub._id} className="border p-4 mb-2 rounded shadow">
          <h2 className="text-lg font-semibold">{sub.name}</h2>
          <p>Price: ₹{sub.price}</p>
          <p>Validity: {sub.validityDays} days</p>
          <p>Status: {sub.isActive ? "Active" : "Hidden"}</p>
          <div className="mt-2 space-x-2">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => openEditModal(sub)}
            >
              Update
            </button>
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded"
              onClick={() => handleHide(sub._id, sub.isActive)}
            >
              {sub.isActive ? "Hide from user" : "Unhide"}
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleDelete(sub._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Modal */}
      <BaseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSub ? "Update Subscription" : "Create Subscription"}
      >
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Plan Name</label>
            <select
              className="border w-full px-3 py-1 rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value as Sub["name"],
                })
              }
              disabled={!!editingSub} // prevent changing type during update
            >
              <option value="BASIC">BASIC</option>
              <option value="PRO">PRO</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseInt(e.target.value) })
              }
              className="border w-full px-3 py-1 rounded"
            />
          </div>
          <div>
            <label className="block font-medium">Validity Days</label>
            <input
              type="number"
              value={formData.validityDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  validityDays: parseInt(e.target.value),
                })
              }
              className="border w-full px-3 py-1 rounded"
            />
          </div>
          <div className="text-right">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleSubmit}
            >
              {editingSub ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </BaseModal>
    </div>
  );
};

export default SubscriptionManagementPage;
