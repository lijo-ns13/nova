import React from "react";
import { Subscription } from "../../types/subscription";

import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Button from "../../../../components/ui/Button";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  isToggleLoading: boolean;
  isDeleteLoading: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
  onToggleStatus,
  isToggleLoading,
  isDeleteLoading,
}) => {
  const { _id, name, price, validityDays, isActive, createdAt } = subscription;

  // Determine card styling based on plan type
  const getPlanColor = () => {
    switch (name) {
      case "BASIC":
        return "border-blue-200 bg-blue-50";
      case "PRO":
        return "border-purple-200 bg-purple-50";
      case "PREMIUM":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-gray-200 bg-white";
    }
  };

  // Determine badge styling based on status
  const getStatusBadge = () => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  // Format date for better readability
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`rounded-lg border-2 shadow-sm transition-all duration-300 hover:shadow-md ${getPlanColor()}`}
    >
      <div className="p-5">
        {/* Header with plan name and status */}
        <div className="flex items-start justify-between mb-4">
          <h3
            className={`text-xl font-bold ${
              name === "BASIC"
                ? "text-blue-600"
                : name === "PRO"
                ? "text-purple-600"
                : "text-yellow-600"
            }`}
          >
            {name}
          </h3>
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadge()}`}
          >
            {isActive ? "Active" : "Hidden"}
          </span>
        </div>

        {/* Plan details */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Price:</span>
            <span className="font-semibold text-lg">
              ₹{price.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Validity:</span>
            <span className="font-semibold">{validityDays} days</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-500">Created:</span>
            <span className="text-xs text-gray-500">
              {formatDate(createdAt)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Edit size={16} />}
            onClick={() => onEdit(subscription)}
            disabled={isToggleLoading || isDeleteLoading}
          >
            Edit
          </Button>

          <Button
            variant={isActive ? "outline" : "success"}
            size="sm"
            icon={isActive ? <EyeOff size={16} /> : <Eye size={16} />}
            onClick={() => onToggleStatus(_id, isActive)}
            isLoading={isToggleLoading}
            disabled={isToggleLoading || isDeleteLoading}
          >
            {isActive ? "Hide" : "Activate"}
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={() => onDelete(_id)}
            isLoading={isDeleteLoading}
            disabled={isToggleLoading || isDeleteLoading}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
