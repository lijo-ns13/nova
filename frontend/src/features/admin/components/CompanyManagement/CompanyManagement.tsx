import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import {
  getCompanies,
  blockCompany,
  unblockCompany,
} from "../../services/companyServices";
import { ApiResponse, Company, Pagination } from "../../types/types";

// Component imports
import SearchBar from "../UserManagement/SearchBar";
import PaginationComponent from "../UserManagement/Pagination";
import CompanyTable from "./CompanyTable";
import CompanyCard from "./CompanyCard";
import LoadingIndicator from "../UserManagement/LoadingIndicator";
import ConfirmSoftDeleteModal from "../../../user/componets/modals/ConfirmSoftDeleteModal";

const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    totalCompanies: 0,
    totalPages: 1,
    currentPage: 1,
    companiesPerPage: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"block" | "unblock">("block");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Debounced fetch function
  const debouncedFetchCompanies = debounce(
    async (query: string, pageNum: number) => {
      try {
        setLoading(true);
        const response: ApiResponse = await getCompanies(
          pageNum,
          pagination.companiesPerPage,
          query
        );

        if (response.success) {
          setCompanies(response.data.companies);
          setPagination(response.data.pagination);
          setError(null);
        } else {
          throw new Error(response.message || "Failed to fetch companies");
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to fetch companies");
      } finally {
        setLoading(false);
      }
    },
    2000
  );

  // Fetch companies with current search and page
  const fetchCompanies = (pageNum: number, query: string = searchQuery) => {
    debouncedFetchCompanies(query, pageNum);
  };

  // Initial load and when search/page changes
  useEffect(() => {
    fetchCompanies(1);
  }, []);

  const handleBlock = (company: Company) => {
    setSelectedCompany(company);
    setModalAction(company.isBlocked ? "unblock" : "block");
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedCompany) return;

    try {
      if (selectedCompany.isBlocked) {
        await unblockCompany(selectedCompany._id);
        setCompanies(
          companies.map((company) =>
            company._id == selectedCompany._id
              ? { ...company, isBlocked: false }
              : company
          )
        );
      } else {
        await blockCompany(selectedCompany._id);
        setCompanies(
          companies.map((company) =>
            company._id == selectedCompany._id
              ? { ...company, isBlocked: true }
              : company
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
    fetchCompanies(1, e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    fetchCompanies(1, "");
  };

  const handlePageChange = (newPage: number) => {
    fetchCompanies(newPage);
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
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Loading Indicator */}
          {loading ? (
            <LoadingIndicator />
          ) : (
            <>
              {/* Desktop view: Table */}
              <div className="hidden md:block">
                <CompanyTable companies={companies} onBlock={handleBlock} />
              </div>

              {/* Mobile view: Cards */}
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
                      key={company._id}
                      company={company}
                      onBlock={handleBlock}
                    />
                  ))
                )}
              </div>

              {/* Pagination */}
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
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
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
