// import React from "react";
// import { Link } from "react-router-dom";

// import StatusBadge from "./StatusBadge";
// import { ApplicationStatus } from "../../types/applicant";

// interface ApplicantHeaderProps {
//   user: UserDetails;
//   status: ApplicationStatus;
// }

// const ApplicantHeader: React.FC<ApplicantHeaderProps> = ({ user, status }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
//       <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
//         <div className="relative">
//           <img
//             src={
//               user.profilePicture ??
//               `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                 user.name
//               )}&background=random&size=128`
//             }
//             alt={user.name}
//             className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
//           />
//         </div>

//         <div className="flex-1 text-center sm:text-left space-y-2">
//           <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>

//           <Link
//             to={`/in/${user.username}`}
//             className="text-blue-600 hover:text-blue-800 transition-colors font-medium inline-flex items-center gap-1"
//           >
//             <span>@{user.username}</span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
//               />
//             </svg>
//           </Link>

//           <div className="mt-3">
//             <StatusBadge status={status} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApplicantHeader;
