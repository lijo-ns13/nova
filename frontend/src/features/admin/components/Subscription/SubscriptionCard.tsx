import React from "react";
import { SubscriptionPlanResponse } from "../../types/subscription";

import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Button from "../../../../components/ui/Button";

interface SubscriptionCardProps {
  subscription: SubscriptionPlanResponse;
  onEdit: (subscription: SubscriptionPlanResponse) => void;
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
  const { id, name, price, validityDays, isActive } = subscription;

  // Determine card background color based on plan name
  const getPlanColor = (): string => {
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

  const getStatusBadge = (): string => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div
      className={`rounded-lg border-2 shadow-sm transition-all duration-300 hover:shadow-md ${getPlanColor()}`}
    >
      <div className="p-5">
        {/* Header */}
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

        {/* Plan Details */}
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
        </div>

        {/* Actions */}
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

          {/* <Button
            variant={isActive ? "outline" : "success"}
            size="sm"
            icon={isActive ? <EyeOff size={16} /> : <Eye size={16} />}
            onClick={() => onToggleStatus(id, isActive)}
            isLoading={isToggleLoading}
            disabled={isToggleLoading || isDeleteLoading}
          >
            {isActive ? "Hide" : "Activate"}
          </Button> */}

          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={() => onDelete(id)}
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
