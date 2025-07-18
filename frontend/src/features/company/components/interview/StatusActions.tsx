// import React, { useState } from "react";
// import { ApplicationStatus } from "../../types/applicationTypes";
// import { getStatusMessage } from "../../util/StatusUtils";
// import ScheduleInterviewModal from "./ScheduleInterviewModal";
// import { formatDate } from "date-fns";

// interface StatusActionsProps {
//   status: ApplicationStatus;
//   rejectionReason?: string;
//   applicationId: string;
//   userId: string;
//   onInterviewScheduled?: () => void;
//   scheduledAt?: Date;
// }

// const StatusActions: React.FC<StatusActionsProps> = ({
//   status,
//   rejectionReason,
//   applicationId,
//   userId,
//   onInterviewScheduled,
//   scheduledAt,
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const statusMessage = getStatusMessage(status, rejectionReason);

//   const renderStatusControls = () => {
//     switch (status) {
//       case ApplicationStatus.SHORTLISTED:
//         return (
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//               />
//             </svg>
//             <span>Schedule Interview</span>
//           </button>
//         );
//       case ApplicationStatus.INTERVIEW_SCHEDULED:
//         return (
//           <div className="text-center sm:text-left">
//             {scheduledAt && (
//               <p className="text-sm sm:text-base text-gray-700 mb-2">
//                 <strong>Interview Scheduled:</strong> {scheduledAt.toString()}
//               </p>
//             )}
//             <p className="text-sm sm:text-base text-blue-600">
//               Waiting for applicant to respond to the interview invitation.
//             </p>
//           </div>
//         );
//       case ApplicationStatus.INTERVIEW_PASSED:
//         return (
//           <div className="flex flex-col sm:flex-row gap-3">
//             <button className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 font-medium text-sm sm:text-base">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <span>Make Offer</span>
//             </button>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {statusMessage && (
//         <div
//           className={`p-4 rounded-lg ${
//             [
//               ApplicationStatus.REJECTED,
//               ApplicationStatus.INTERVIEW_FAILED,
//               ApplicationStatus.WITHDRAWN,
//               ApplicationStatus.INTERVIEW_REJECTED_BY_USER,
//             ].includes(status)
//               ? "bg-red-50 text-red-700 border border-red-100"
//               : [
//                   ApplicationStatus.INTERVIEW_PASSED,
//                   ApplicationStatus.SELECTED,
//                   ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER,
//                 ].includes(status)
//               ? "bg-green-50 text-green-700 border border-green-100"
//               : "bg-blue-50 text-blue-700 border border-blue-100"
//           }`}
//         >
//           <div className="flex items-start gap-3">
//             <div className="shrink-0 mt-0.5">
//               {[
//                 ApplicationStatus.REJECTED,
//                 ApplicationStatus.INTERVIEW_FAILED,
//                 ApplicationStatus.WITHDRAWN,
//                 ApplicationStatus.INTERVIEW_REJECTED_BY_USER,
//               ].includes(status) ? (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               ) : [
//                   ApplicationStatus.INTERVIEW_PASSED,
//                   ApplicationStatus.SELECTED,
//                   ApplicationStatus.INTERVIEW_ACCEPTED_BY_USER,
//                 ].includes(status) ? (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               ) : (
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               )}
//             </div>
//             <p className="text-sm sm:text-base">{statusMessage}</p>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-center sm:justify-start">
//         {renderStatusControls()}
//       </div>

//       <ScheduleInterviewModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         applicationId={applicationId}
//         userId={userId}
//         onInterviewScheduled={onInterviewScheduled}
//       />
//     </div>
//   );
// };

// export default StatusActions;
