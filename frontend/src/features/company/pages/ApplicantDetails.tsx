import React, { useState } from "react";
import { format } from "date-fns";
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  CalendarClock,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import StatusBadge from "../../admin/components/UserManagement/StatusBadge";

interface ApplicantDetailsProps {
  applicant: any; // Replace with proper type
  onScheduleInterview: (date: Date) => void;
  onUpdateStatus: (status: string, reason?: string) => void;
}

const ApplicantDetails: React.FC<ApplicantDetailsProps> = ({
  applicant,
  onScheduleInterview,
  onUpdateStatus,
}) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [interviewTime, setInterviewTime] = useState("");

  const handleScheduleInterview = () => {
    if (selectedDate && interviewTime) {
      const [hours, minutes] = interviewTime.split(":");
      const interviewDate = new Date(selectedDate);
      interviewDate.setHours(parseInt(hours), parseInt(minutes));
      onScheduleInterview(interviewDate);
      setIsScheduleModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={applicant.user.profilePicture}
              alt={applicant.user.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {applicant.user.name}
              </h1>
              <p className="text-gray-600">
                {applicant.user.headline || "Job Seeker"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={applicant.status} />
            <a
              href={applicant.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download size={18} />
              View Resume
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700">
              {applicant.user.about || "No description provided."}
            </p>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Experience
            </h2>
            {applicant.user.experiences &&
            applicant.user.experiences.length > 0 ? (
              <div className="space-y-4">
                {applicant.user.experiences.map((exp: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <Briefcase className="flex-shrink-0 w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">{exp.title}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(exp.startDate), "MMM yyyy")} -{" "}
                        {exp.endDate
                          ? format(new Date(exp.endDate), "MMM yyyy")
                          : "Present"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No experience listed</p>
            )}
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Education
            </h2>
            {applicant.user.educations &&
            applicant.user.educations.length > 0 ? (
              <div className="space-y-4">
                {applicant.user.educations.map((edu: any, index: number) => (
                  <div key={index} className="flex gap-4">
                    <GraduationCap className="flex-shrink-0 w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {edu.degree}
                      </h3>
                      <p className="text-gray-600">{edu.school}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(edu.startDate), "yyyy")} -{" "}
                        {edu.endDate
                          ? format(new Date(edu.endDate), "yyyy")
                          : "Present"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No education listed</p>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
            {applicant.user.skills && applicant.user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {applicant.user.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills listed</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <a
                  href={`mailto:${applicant.user.email}`}
                  className="text-gray-600 hover:text-indigo-600"
                >
                  {applicant.user.email}
                </a>
              </div>
              {applicant.user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a
                    href={`tel:${applicant.user.phone}`}
                    className="text-gray-600 hover:text-indigo-600"
                  >
                    {applicant.user.phone}
                  </a>
                </div>
              )}
              {applicant.user.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    {applicant.user.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Application Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Application Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Applied on</p>
                  <p className="text-gray-700">
                    {format(new Date(applicant.appliedAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              {applicant.statusHistory && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Status History
                  </h3>
                  <div className="space-y-3">
                    {applicant.statusHistory.map(
                      (history: any, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="mt-1">
                            {history.status === "rejected" ? (
                              <XCircle className="w-5 h-5 text-red-500" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {history.status.charAt(0).toUpperCase() +
                                history.status.slice(1)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(
                                new Date(history.changedAt),
                                "MMM d, yyyy h:mm a"
                              )}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <CalendarClock size={18} />
                Schedule Interview
              </button>
              <button
                onClick={() => onUpdateStatus("shortlisted")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={18} />
                Shortlist
              </button>
              <button
                onClick={() => onUpdateStatus("rejected")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle size={18} />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Schedule Modal */}
      <Dialog
        open={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />

          <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
              Schedule Interview
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) =>
                    setSelectedDate(
                      e.target.value ? new Date(e.target.value) : null
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => setInterviewTime(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleInterview}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  disabled={!selectedDate || !interviewTime}
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ApplicantDetails;
