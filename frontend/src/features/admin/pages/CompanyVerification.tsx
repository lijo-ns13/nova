import React, { useEffect, useState } from "react";
import {
  getUnverifiedCompanies,
  verifyCompany,
} from "../services/companyServices";
import {
  CompanyDocumentDTO,
  UnverifiedCompaniesResponse,
} from "../types/company";
import SecureDocViewer from "../../../components/SecureDocViewer";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { predefinedRejectionReasons } from "../constants/company.reject.constant";
import LoadingSpinner from "../../../components/LoadingSpinner";

const CompanyVerificationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [customReason, setCustomReason] = useState("");
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [companies, setCompanies] = useState<CompanyDocumentDTO[]>([]);
  const [pagination, setPagination] = useState<
    UnverifiedCompaniesResponse["pagination"] | null
  >(null);
  const [selectedCompany, setSelectedCompany] =
    useState<CompanyDocumentDTO | null>(null);

  useEffect(() => {
    fetchUnverifiedCompanies();
  }, []);

  const fetchUnverifiedCompanies = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getUnverifiedCompanies(page, 10);
      setCompanies(res.companies);
      setPagination(res.pagination);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch unverified companies.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (company: CompanyDocumentDTO) => {
    setSelectedCompany(company);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCompany(null);
    setSelectedReasons([]);
    setCustomReason("");
  };

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleVerification = async (status: "accepted" | "rejected") => {
    if (!selectedCompany) return;

    const finalReason =
      status === "rejected"
        ? [...selectedReasons, customReason.trim()].filter(Boolean).join(", ")
        : undefined;

    if (status === "rejected" && !finalReason) {
      toast.error("Please select or enter at least one rejection reason.");
      return;
    }

    setActionLoading(true);
    try {
      await verifyCompany(selectedCompany.id, status, finalReason);
      toast.success(
        `Company ${
          status === "accepted" ? "verified" : "rejected"
        } successfully.`
      );
      await fetchUnverifiedCompanies(pagination?.currentPage || 1);
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${status} company.`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Unverified Companies
      </h2>

      {loading ? (
        <LoadingSpinner />
      ) : companies.length === 0 ? (
        <p className="text-center text-gray-500">
          No unverified companies found.
        </p>
      ) : (
        <div className="grid gap-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {company.companyName}
                </h3>
                <p className="text-sm text-gray-600">{company.email}</p>
                <p className="text-sm text-gray-600">
                  Industry: {company.industryType}
                </p>
              </div>
              <button
                onClick={() => openModal(company)}
                className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Review & Verify
              </button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white w-full max-w-3xl rounded-lg overflow-y-auto max-h-[90vh] relative shadow-xl">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              &#10005;
            </button>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                Review Company: {selectedCompany.companyName}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <p>
                    <strong>Email:</strong> {selectedCompany.email}
                  </p>
                  <p>
                    <strong>Industry:</strong> {selectedCompany.industryType}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedCompany.verificationStatus}
                  </p>
                  <p>
                    <strong>Verified:</strong>{" "}
                    {selectedCompany.isVerified ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Blocked:</strong>{" "}
                    {selectedCompany.isBlocked ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>ID:</strong> {selectedCompany.id}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Submitted Documents
                </h4>
                {selectedCompany.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCompany.documents.map((doc, idx) => (
                      <SecureDocViewer resumeUrl={doc} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No documents submitted.
                  </p>
                )}
              </div>

              <div className="mt-6 border-t pt-4">
                <div className="flex flex-col gap-2">
                  <span className="font-medium text-gray-800">
                    Rejection Reasons
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {predefinedRejectionReasons.map((reason) => (
                      <label
                        key={reason}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedReasons.includes(reason)}
                          onChange={() => handleReasonToggle(reason)}
                        />
                        {reason}
                      </label>
                    ))}
                  </div>
                  <input
                    className="border mt-2 p-2 rounded text-sm"
                    placeholder="Add custom reason (optional)"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => handleVerification("rejected")}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? "Rejecting..." : "Reject"}
                </button>
                <button
                  onClick={() => handleVerification("accepted")}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => fetchUnverifiedCompanies(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchUnverifiedCompanies(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyVerificationPage;
