import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  UserCheck,
  Award,
  FileCheck,
  FileX,
  AlertTriangle,
  CreditCard,
  UserPlus,
} from "lucide-react";

interface StatusHistoryItem {
  status: string;
  updatedAt: string;
  reason?: string;
}

interface ApplicationTimelineProps {
  statusHistory: StatusHistoryItem[];
}

const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  statusHistory,
}) => {
  // Sort history by date (newest first)
  const sortedHistory = [...statusHistory].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // Get icon based on status
  const getStatusIcon = (status: string) => {
    const statusMap: Record<string, React.ReactNode> = {
      applied: <Clock size={16} className="text-blue-500" />,
      shortlisted: <CheckCircle size={16} className="text-green-500" />,
      rejected: <XCircle size={16} className="text-red-500" />,
      interview_scheduled: <Calendar size={16} className="text-purple-500" />,
      interview_rescheduled: <Calendar size={16} className="text-amber-500" />,
      interview_accepted_by_user: (
        <UserCheck size={16} className="text-blue-500" />
      ),
      interview_rejected_by_user: (
        <XCircle size={16} className="text-red-500" />
      ),
      interview_cancelled: <XCircle size={16} className="text-red-500" />,
      interview_completed: <FileCheck size={16} className="text-green-500" />,
      interview_passed: <Award size={16} className="text-green-500" />,
      interview_failed: <FileX size={16} className="text-red-500" />,
      offered: <CreditCard size={16} className="text-blue-500" />,
      hired: <UserPlus size={16} className="text-green-500" />,
      withdrawn: <AlertTriangle size={16} className="text-amber-500" />,
      selected: <CheckCircle size={16} className="text-green-500" />,
    };

    return (
      statusMap[status.toLowerCase()] || (
        <Clock size={16} className="text-gray-500" />
      )
    );
  };

  // If no history, show empty state
  if (sortedHistory.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No application history available.
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedHistory.map((item, index) => (
          <li key={index}>
            <div className="relative pb-8">
              {index !== sortedHistory.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              ) : null}

              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center ring-8 ring-white">
                    {getStatusIcon(item.status)}
                  </div>
                </div>

                <div className="min-w-0 flex-1 py-1.5">
                  <div className="text-sm text-slate-900">
                    <span className="font-medium capitalize">
                      {item.status.replace(/_/g, " ")}
                    </span>
                    <span className="mx-2 text-slate-400">•</span>
                    <time className="text-slate-500">
                      {new Date(item.updatedAt).toLocaleString()}
                    </time>
                  </div>

                  {item.reason && (
                    <div className="mt-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <span className="font-medium">Reason: </span>
                      {item.reason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicationTimeline;
