import React from "react";
import { Feature } from "../../types/feature";
import { Edit, Trash2 } from "lucide-react";
import Button from "../../../../components/ui/Button";

interface FeatureCardProps {
  feature: Feature;
  onEdit: (feature: Feature) => void;
  onDelete: (id: string) => void;
  isDeleteLoading: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  feature,
  onEdit,
  onDelete,
  isDeleteLoading,
}) => {
  const { id, name, isActive = true } = feature;

  // Determine card styling
  const getCardStyle = () => {
    return "border-teal-200 bg-teal-50";
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
      className={`rounded-lg border-2 shadow-sm transition-all duration-300 hover:shadow-md ${getCardStyle()}`}
    >
      <div className="p-5">
        {/* Header with feature name and status */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-teal-600">{name}</h3>
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusBadge()}`}
          >
            {isActive ? "Active" : "Hidden"}
          </span>
        </div>

        {/* Feature details */}
        <div className="space-y-3 mb-6">
          {/* <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-xs text-gray-500">Created:</span>
            <span className="text-xs text-gray-500">
              {formatDate(createdAt)}
            </span>
          </div> */}

          {/* {feature.updatedAt && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Last Updated:</span>
              <span className="text-xs text-gray-500">
                {formatDate(feature.updatedAt)}
              </span>
            </div>
          )} */}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Edit size={16} />}
            onClick={() => onEdit(feature)}
            disabled={isDeleteLoading}
          >
            Edit
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 size={16} />}
            onClick={() => onDelete(id)}
            isLoading={isDeleteLoading}
            disabled={isDeleteLoading}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
