import React, { useEffect, useState } from "react";
import {
  getCompanies,
  blockCompany,
  unblockCompany,
} from "../services/companyServices";

interface Company {
  _id: string;
  companyName: string;
  email: string;
  isBlocked: boolean;
}

const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async (page: number = 1) => {
    setLoading(true);
    try {
      const data = await getCompanies(page, 10);
      setCompanies(data.companies);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.currentPage);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (company: Company) => {
    try {
      if (company.isBlocked) {
        await unblockCompany(company._id);
      } else {
        await blockCompany(company._id);
      }
      fetchCompanies(currentPage); // Refresh list after action
    } catch (err: any) {
      setError(err.message || "Action failed");
    }
  };

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Company Management</h2>

      {loading && <p>Loading companies...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No companies found.
                </td>
              </tr>
            )}

            {companies.map((company) => (
              <tr key={company._id} className="border-t">
                <td className="py-2 px-4">{company.companyName}</td>
                <td className="py-2 px-4">{company.email}</td>
                <td className="py-2 px-4">
                  {company.isBlocked ? (
                    <span className="text-red-600 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleBlockToggle(company)}
                    className={`px-4 py-2 rounded text-white ${
                      company.isBlocked
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {company.isBlocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompanyManagement;
