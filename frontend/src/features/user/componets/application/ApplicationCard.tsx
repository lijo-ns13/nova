import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import {
  acceptReschedule,
  getRescheduleSlots,
  updateInterviewStatus,
} from "../../services/InterviewRescheduleService";
import { ApplicationStatus } from "../../../../constants/applicationStatus";
import { AppliedJobResponseDTO } from "../../services/JobServices";

interface Props {
  appliedJob: AppliedJobResponseDTO;
  onStatusUpdate: () => void;
}

function AppliedJobCard({ appliedJob, onStatusUpdate }: Props) {
  const [rescheduleSlots, setRescheduleSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const { job, status, _id: applicationId, scheduledAt } = appliedJob;

  const handleAccept = async () => {
    try {
      await updateInterviewStatus(
        applicationId,
        ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER
      );
      toast.success("Interview accepted");
      onStatusUpdate();
    } catch (err) {
      toast.error("Failed to accept interview");
    }
  };

  const handleReject = async () => {
    try {
      await updateInterviewStatus(
        applicationId,
        ApplicationStatus.INTERVIEW_REJECTED_BY_USER
      );
      toast.success("Interview rejected");
      onStatusUpdate();
    } catch (err) {
      toast.error("Failed to reject interview");
    }
  };

  const fetchRescheduleSlots = async () => {
    try {
      const res = await getRescheduleSlots(applicationId);
      setRescheduleSlots(res.data);
    } catch {
      toast.error("Failed to fetch slots");
    }
  };

  const handleRescheduleDecision = async (accepted: boolean) => {
    try {
      if (accepted && selectedSlot) {
        await acceptReschedule(
          applicationId,
          "interview_reschedule_accepted",
          selectedSlot
        );
        toast.success("Reschedule accepted");
      } else {
        await acceptReschedule(applicationId, "interview_reschedule_rejected");
        toast.success("Reschedule rejected");
      }
      onStatusUpdate();
    } catch {
      toast.error("Failed to submit reschedule response");
    }
  };

  useEffect(() => {
    if (status === ApplicationStatus.INTERVIEW_RESCHEDULE_PROPOSED) {
      fetchRescheduleSlots();
    }
  }, [status]);

  return (
    <div className="border rounded p-4 mb-4">
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-sm text-gray-600">
        {job.location} • {job.jobType}
      </p>
      <p className="text-sm mt-2">
        Status: <strong>{status.replace(/_/g, " ")}</strong>
      </p>
      {scheduledAt && (
        <p className="text-sm">
          Scheduled At: {new Date(scheduledAt).toLocaleString()}
        </p>
      )}

      {/* Actions for interview scheduled */}
      {status === ApplicationStatus.INTERVIEW_SCHEDULED && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAccept}
            className="bg-green-500 text-white px-4 py-1 rounded"
          >
            Accept Interview
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Reject Interview
          </button>
        </div>
      )}

      {/* Actions for reschedule proposed */}
      {status === ApplicationStatus.INTERVIEW_RESCHEDULE_PROPOSED && (
        <div className="mt-4">
          <label className="block text-sm mb-1">
            Select a reschedule slot:
          </label>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">-- Select --</option>
            {rescheduleSlots.map((slot) => (
              <option key={slot} value={slot}>
                {new Date(slot).toLocaleString()}
              </option>
            ))}
          </select>
          <div className="flex gap-2 mt-2">
            <button
              disabled={!selectedSlot}
              onClick={() => handleRescheduleDecision(true)}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Accept Slot
            </button>
            <button
              onClick={() => handleRescheduleDecision(false)}
              className="bg-gray-500 text-white px-4 py-1 rounded"
            >
              Reject Reschedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppliedJobCard;
