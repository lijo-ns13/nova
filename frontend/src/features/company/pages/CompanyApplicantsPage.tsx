// import React, { useEffect, useState } from "react";
// import ApplicantList from "../components/ApplicantList";
// import FilterBar from "../components/FilterBar";
// import Pagination from "../../admin/components/UserManagement/Pagination";
// import LoadingIndicator from "../../admin/components/UserManagement/LoadingIndicator";
// import EmptyState from "../components/EmptyState";
// import {
//   applicantService,
//   Application,
//   FilterParams,
//   PaginationInfo,
// } from "../services/applicantService";
// import { useParams } from "react-router-dom";
// const CompanyApplicantPage: React.FC = () => {
//   // Mock job ID - in a real app this would come from a route parameter
//   const { jobId } = useParams();

//   const [applications, setApplications] = useState<Application[]>([]);
//   const [pagination, setPagination] = useState<PaginationInfo>({
//     totalApplications: 0,
//     totalPages: 0,
//     currentPage: 1,
//     applicationsPerPage: 10,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Filter states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sortOrder, setSortOrder] = useState("newest");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");

//   useEffect(() => {
//     fetchApplications();
//   }, [pagination.currentPage, statusFilter, sortOrder, dateFrom, dateTo]);

//   // Debounced search effect
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       fetchApplications();
//     }, 300);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [searchTerm]);

//   const fetchApplications = async () => {
//     try {
//       setLoading(true);

//       const filters: FilterParams = {
//         page: pagination.currentPage,
//         limit: pagination.applicationsPerPage,
//         search: searchTerm,
//         ...(statusFilter !== "all" && { status: statusFilter }),
//         ...(dateFrom && { dateFrom }),
//         ...(dateTo && { dateTo }),
//       };
//       let result;
//       if (jobId) {
//         result = await applicantService.getApplications(jobId, filters);
//         console.log("result", result);
//       }
//       if (result) {
//         setApplications(result.data.applications);
//         setPagination(result.data.pagination);
//       }

//       setError("");
//     } catch (err) {
//       setError("Failed to load applications. Please try again.");
//       console.error("Error fetching applications:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePageChange = (page: number) => {
//     setPagination((prev) => ({
//       ...prev,
//       currentPage: page,
//     }));
//   };

//   const handleStatusChange = async (
//     applicationId: string,
//     newStatus: "applied" | "shortlisted" | "rejected",
//     reason?: string
//   ) => {
//     try {
//       if (newStatus === "shortlisted") {
//         await applicantService.shortlistApplicaton(applicationId);
//       } else if (newStatus === "rejected") {
//         await applicantService.rejectApplication(applicationId, reason);
//       }

//       // Update the local state
//       setApplications((prevApplications) =>
//         prevApplications.map((app) =>
//           app._id === applicationId
//             ? {
//                 ...app,
//                 status: newStatus,
//                 statusHistory: [
//                   ...(app.statusHistory || []),
//                   {
//                     status: newStatus,
//                     date: new Date().toISOString(),
//                     ...(reason && { note: reason }),
//                   },
//                 ],
//               }
//             : app
//         )
//       );
//     } catch (error) {
//       console.error("Error updating application status:", error);
//       setError("Failed to update application status. Please try again.");
//     }
//   };

//   const hasFilters =
//     searchTerm !== "" ||
//     statusFilter !== "all" ||
//     dateFrom !== "" ||
//     dateTo !== "";

//   if (loading && applications.length === 0) {
//     return <LoadingIndicator />;
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Job Applicants</h1>
//         <p className="mt-2 text-gray-600">
//           {pagination.totalApplications} applicants found
//         </p>
//       </div>

//       <FilterBar
//         onSearchChange={setSearchTerm}
//         onStatusChange={setStatusFilter}
//         onSortChange={setSortOrder}
//         onDateChange={(from, to) => {
//           setDateFrom(from);
//           setDateTo(to);
//         }}
//         searchValue={searchTerm}
//         statusValue={statusFilter}
//         sortValue={sortOrder}
//       />

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
//           {error}
//         </div>
//       )}

//       {!loading && applications.length === 0 ? (
//         <EmptyState hasFilters={hasFilters} />
//       ) : (
//         <ApplicantList
//           applications={applications}
//           onStatusChange={handleStatusChange}
//         />
//       )}

//       {pagination.totalPages > 1 && (
//         <div className="mt-8">
//           <Pagination
//             currentPage={pagination.currentPage}
//             totalPages={pagination.totalPages}
//             totalItems={pagination.totalApplications}
//             itemsPerPage={pagination.applicationsPerPage}
//             onPageChange={handlePageChange}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyApplicantPage;
