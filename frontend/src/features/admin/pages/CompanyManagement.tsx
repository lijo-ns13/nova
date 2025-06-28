import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import {
  getCompanies,
  blockCompany,
  unblockCompany,
} from "../services/companyServices";
import { ApiResponse, Company, Pagination } from "../types/types";
interface ApiError {
  message: string;
}
const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    totalCompanies: 0,
    totalPages: 1,
    currentPage: 1,
    companiesPerPage: 10,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchCompanies = useCallback(
    debounce(async (query: string, page: number) => {
      try {
        setLoading(true);
        const response: ApiResponse = await getCompanies(page, 10, query);

        if (response.success) {
          setCompanies(response.data.companies || []);
          setPagination(
            response.data.pagination || {
              totalCompanies: 0,
              totalPages: 1,
              currentPage: 1,
              companiesPerPage: 10,
            }
          );
          setError(null);
        } else {
          throw new Error(response.message || "Failed to fetch companies");
        }
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message);
        setCompanies([]);
        setPagination({
          totalCompanies: 0,
          totalPages: 1,
          currentPage: 1,
          companiesPerPage: 10,
        });
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    fetchCompanies(e.target.value, 1);
  };

  const handleBlockToggle = async (company: Company) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${company.isBlocked ? "unblock" : "block"} ${
        company.companyName
      }?`
    );

    if (!confirmAction) return;

    try {
      if (company.isBlocked) {
        await unblockCompany(company._id);
      } else {
        await blockCompany(company._id);
      }
      fetchCompanies(searchQuery, pagination.currentPage);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "Action failed");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCompanies(searchQuery, newPage);
    }
  };

  useEffect(() => {
    fetchCompanies("", 1);
  }, []);

  // Get first document as profile picture if available
  const getProfilePicture = (company: Company) => {
    return company.documents?.[0] || company.profilePicture;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Company Management
        </h1>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search companies by name or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  fetchCompanies("", 1);
                }}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Companies Table */}
        {!loading && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Company
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Industry
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Verification
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {companies.length > 0 ? (
                    companies.map((company) => (
                      <tr key={company._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {getProfilePicture(company) && (
                              <img
                                src={getProfilePicture(company)}
                                alt={company.companyName}
                                className="w-8 h-8 rounded-full mr-3 object-cover"
                              />
                            )}
                            <span>{company.companyName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{company.email}</td>
                        <td className="py-3 px-4">
                          {company.industryType || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              company.isBlocked
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {company.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              company.isVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {company.isVerified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleBlockToggle(company)}
                            className={`px-4 py-2 rounded text-white text-sm font-medium ${
                              company.isBlocked
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            {company.isBlocked ? "Unblock" : "Block"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-6 text-center text-gray-500"
                      >
                        {searchQuery
                          ? "No companies found matching your search"
                          : "No companies available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  {(pagination.currentPage - 1) * pagination.companiesPerPage +
                    1}{" "}
                  to{" "}
                  {Math.min(
                    pagination.currentPage * pagination.companiesPerPage,
                    pagination.totalCompanies
                  )}{" "}
                  of {pagination.totalCompanies} companies
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`px-4 py-2 border rounded-md ${
                      pagination.currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (
                        pagination.currentPage >=
                        pagination.totalPages - 2
                      ) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 border rounded-md ${
                            pagination.currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`px-4 py-2 border rounded-md ${
                      pagination.currentPage === pagination.totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyManagement;
