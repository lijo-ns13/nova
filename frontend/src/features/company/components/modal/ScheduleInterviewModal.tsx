import React, { useState } from "react";
import BaseModal from "../../../user/componets/modals/BaseModal"; // Ensure correct path

import companyAxios from "../../../../utils/companyAxios";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  userId: string;
  onInterviewScheduled?: () => void;
}

const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  userId,
  onInterviewScheduled,
}) => {
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSchedule = async () => {
    if (!scheduledAt) {
      setError("Please select a date and time.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await companyAxios.post("/interview", {
        userId,
        applicationId,
        scheduledAt,
      });

      if (response.data.success) {
        onInterviewScheduled?.();
        onClose();
      } else {
        setError("Failed to schedule interview.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Schedule Interview">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Interview Date & Time
        </label>
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          onClick={handleSchedule}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          {loading ? "Scheduling..." : "Schedule Interview"}
        </button>
      </div>
    </BaseModal>
  );
};

export default ScheduleInterviewModal;
