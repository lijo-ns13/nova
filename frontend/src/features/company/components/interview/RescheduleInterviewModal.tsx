// components/interview/RescheduleInterviewModal.tsx
import React, { useState } from "react";
import { Calendar, Clock, X } from "lucide-react";

import { toast } from "../ui/Toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { companyInterviewService } from "../../services/InterviewReschedueService";

interface RescheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  userId: string;
  currentInterviewTime: string;
  onInterviewRescheduled: () => void;
}

const RescheduleInterviewModal: React.FC<RescheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  userId,
  currentInterviewTime,
  onInterviewRescheduled,
}) => {
  const [reason, setReason] = useState("");
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (timeSlots.length !== 3) {
      setError("Please select exactly 3 time slots");
      return;
    }

    if (!reason.trim()) {
      setError("Please provide a reason for rescheduling");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await companyInterviewService.proposeReschedule(
        applicationId,
        reason,
        timeSlots.map((slot) => slot.toISOString())
      );

      toast({
        title: "Reschedule Request Sent",
        description: "The candidate will be notified of your proposed times",
        variant: "success",
      });

      onInterviewRescheduled();
      onClose();
    } catch (err) {
      console.log(err);
      setError(
        err.response.data.message ||
          "Failed to submit reschedule request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const addTimeSlot = (date: Date) => {
    const isDuplicate = timeSlots.some(
      (slot) => slot.getTime() === date.getTime()
    );

    if (isDuplicate) {
      toast({
        title: "Duplicate Time Slot",
        description: "This time slot has already been selected.",
      });
      return;
    }

    if (timeSlots.length >= 3) {
      toast({
        title: "Limit Reached",
        description: "You can only select up to 3 time slots.",
      });
      return;
    }

    setTimeSlots([...timeSlots, date]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Clock className="mr-2" size={20} />
            Reschedule Interview
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Current scheduled time:{" "}
              <span className="font-medium">
                {new Date(currentInterviewTime).toLocaleString()}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rescheduling <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                rows={3}
                placeholder="Please provide a reason for rescheduling..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select 3 Alternative Time Slots{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="mb-2">
                <DatePicker
                  selected={null}
                  onChange={(date: Date) => addTimeSlot(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  placeholderText="Click to add a time slot"
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>

              <div className="space-y-2">
                {timeSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span>{slot.toLocaleString()}</span>
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                disabled={loading || timeSlots.length !== 3 || !reason.trim()}
              >
                {loading ? "Submitting..." : "Submit Reschedule Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RescheduleInterviewModal;
