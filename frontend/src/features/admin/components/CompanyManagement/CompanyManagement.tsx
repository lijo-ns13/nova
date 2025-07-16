import React, { useEffect, useState, useCallback } from "react";
import {
  getCompanies,
  blockCompany,
  unblockCompany,
} from "../../services/companyServices";

import { useDebounce } from "../../../../hooks/useDebounce"; // Import your custom hook

// Component imports
import SearchBar from "../UserManagement/SearchBar";
import PaginationComponent from "../UserManagement/Pagination";
import CompanyTable from "./CompanyTable";
import CompanyCard from "./CompanyCard";

import ConfirmSoftDeleteModal from "../../../user/componets/modals/ConfirmSoftDeleteModal";
export interface CompanyResponse {
  id: string;
  companyName: string;
  email: string;
  isBlocked: boolean;
  profilePicture: string | null;
}

export interface Pagination {
  totalCompanies: number;
  totalPages: number;
  currentPage: number;
  companiesPerPage: number;
}

export interface PaginatedCompanyResponse {
  companies: CompanyResponse[];
  total: number;
  page: number;
  limit: number;
}
const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    totalCompanies: 0,
    totalPages: 1,
    currentPage: 1,
    companiesPerPage: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Using your debounce hook
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"block" | "unblock">("block");
  const [selectedCompany, setSelectedCompany] =
    useState<CompanyResponse | null>(null);

  const fetchCompanies = useCallback(
    async (query: string, pageNum: number, isInitial = false) => {
      try {
        const response = await getCompanies(
          pageNum,
          pagination.companiesPerPage,
          query
        );
        console.log(response, "resy");

        setCompanies(response.companies);
        setPagination({
          totalCompanies: response.total,
          totalPages: Math.ceil(response.total / response.limit),
          currentPage: response.page,
          companiesPerPage: response.limit,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to fetch companies");
      }
    },
    [pagination.companiesPerPage]
  );

  // Fetch companies when debounced search query or page changes
  // Initial load
  useEffect(() => {
    fetchCompanies(searchQuery, 1, true); // initial = true
  }, [fetchCompanies]);

  // Search or page change
  useEffect(() => {
    fetchCompanies(debouncedSearchQuery, pagination.currentPage, false);
  }, [debouncedSearchQuery, fetchCompanies, pagination.currentPage]);

  const handleBlock = (company: CompanyResponse) => {
    setSelectedCompany(company);
    setModalAction(company.isBlocked ? "unblock" : "block");
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedCompany) return;

    try {
      if (selectedCompany.isBlocked) {
        await unblockCompany(selectedCompany.id);
        setCompanies((prev) =>
          prev.map((c) =>
            c.id === selectedCompany.id ? { ...c, isBlocked: false } : c
          )
        );
      } else {
        await blockCompany(selectedCompany.id);
        setCompanies((prev) =>
          prev.map((c) =>
            c.id === selectedCompany.id ? { ...c, isBlocked: true } : c
          )
        );
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error updating company status:", err);
      setError("Failed to update company status");
      setShowModal(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    fetchCompanies(debouncedSearchQuery, newPage);
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-850 shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              Company Management
            </h1>
            <div className="w-full sm:w-auto">
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                onClear={handleClearSearch}
                placeholder="Search companies..."
              />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {
            <>
              <div className="hidden md:block">
                <CompanyTable companies={companies} onBlock={handleBlock} />
              </div>

              <div className="md:hidden space-y-3">
                {companies.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchQuery
                        ? "No companies found"
                        : "No companies available"}
                    </p>
                  </div>
                ) : (
                  companies.map((company) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                      onBlock={handleBlock}
                    />
                  ))
                )}
              </div>

              {pagination.totalPages > 1 && (
                <div className="mt-6">
                  <PaginationComponent
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalCompanies}
                    itemsPerPage={pagination.companiesPerPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          }
        </div>
      </div>

      <ConfirmSoftDeleteModal
        isOpen={showModal}
        onConfirm={handleConfirmAction}
        onCancel={() => setShowModal(false)}
        itemType={modalAction === "block" ? "block" : "unblock"}
        itemName={selectedCompany?.companyName || "Company"}
        extraMessage={`Are you sure you want to ${modalAction} this company?`}
      />
    </div>
  );
};

export default CompanyManagement;
