import React, { useEffect, useState } from "react";
import adminAxios from "../../../utils/adminAxios";

// Types
interface Company {
  _id: string;
  companyName: string;
  email: string;
  industryType: string;
  foundedYear: number;
  location: string;
  verificationStatus: string;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: string;
  about?: string;
  documents: string[];
}

const CompanyVerificationPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectReasonInput, setShowRejectReasonInput] = useState(false);

  useEffect(() => {
    fetchUnverifiedCompanies();
  }, []);

  const fetchUnverifiedCompanies = async () => {
    try {
      const res = await adminAxios.get(
        "http://localhost:3000/admin/companies/unverified"
      );
      setCompanies(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch unverified companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (company: Company) => {
    setSelectedCompany(company);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCompany(null);
  };

  const handleVerification = async (
    status: "accepted" | "rejected",
    reason?: string
  ) => {
    if (!selectedCompany) return;
    setActionLoading(true);

    try {
      await adminAxios.patch(
        `http://localhost:3000/admin/companies/verify/${selectedCompany._id}`,
        { status, rejectionReason: reason }
      );

      fetchUnverifiedCompanies();
      closeModal();
    } catch (err) {
      console.error(`Failed to ${status} company:`, err);
    } finally {
      setActionLoading(false);
      setRejectionReason("");
      setShowRejectReasonInput(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Unverified Companies
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : companies.length === 0 ? (
        <p className="text-center text-gray-500">
          No unverified companies found.
        </p>
      ) : (
        <div className="grid gap-4">
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col sm:flex-row sm:items-center justify-between transition hover:shadow-lg"
            >
              <div className="mb-4 sm:mb-0">
                <h3 className="text-xl font-semibold text-gray-800">
                  {company.companyName}
                </h3>
                <p className="text-sm text-gray-500">{company.email}</p>
                <p className="text-sm text-gray-600">
                  Industry: {company.industryType}
                </p>
              </div>

              <button
                onClick={() => openModal(company)}
                className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Review & Verify
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {modalOpen && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✖
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                Review Company: {selectedCompany.companyName}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {selectedCompany.email}
                  </p>
                  <p>
                    <span className="font-medium">Industry:</span>{" "}
                    {selectedCompany.industryType}
                  </p>
                  <p>
                    <span className="font-medium">Founded Year:</span>{" "}
                    {selectedCompany.foundedYear}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {selectedCompany.location}
                  </p>
                </div>

                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Verification Status:</span>{" "}
                    {selectedCompany.verificationStatus}
                  </p>
                  <p>
                    <span className="font-medium">Is Verified:</span>{" "}
                    {selectedCompany.isVerified ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium">Blocked:</span>{" "}
                    {selectedCompany.isBlocked ? "Yes" : "No"}
                  </p>
                  <p>
                    <span className="font-medium">Created At:</span>{" "}
                    {new Date(selectedCompany.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* About */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-2">
                  About Company
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedCompany.about || "No description provided."}
                </p>
              </div>

              {/* Documents */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-800 mb-2">
                  Submitted Documents
                </h3>
                {selectedCompany.documents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCompany.documents.map((docUrl, index) => (
                      <div
                        key={index}
                        className="border rounded-md bg-gray-50 p-2 flex flex-col items-center justify-center"
                      >
                        {docUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                          <img
                            src={docUrl}
                            alt={`Document ${index + 1}`}
                            className="h-40 w-full object-cover cursor-pointer rounded hover:opacity-80 transition"
                            onClick={() => setPreviewImage(docUrl)}
                          />
                        ) : (
                          <a
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline text-sm"
                          >
                            View Document {index + 1}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    No documents uploaded.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                {!showRejectReasonInput ? (
                  <>
                    <button
                      onClick={() => setShowRejectReasonInput(true)}
                      disabled={actionLoading}
                      className="px-5 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerification("accepted")}
                      disabled={actionLoading}
                      className="px-5 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {actionLoading ? "Processing..." : "Verify"}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-4 w-full">
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Enter rejection reason..."
                      className="p-2 border rounded-md text-sm"
                      rows={3}
                    />
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => {
                          setShowRejectReasonInput(false);
                          setRejectionReason("");
                        }}
                        className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          handleVerification("rejected", rejectionReason)
                        }
                        disabled={actionLoading || !rejectionReason.trim()}
                        className="px-5 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {actionLoading ? "Processing..." : "Confirm Rejection"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fadeIn"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl w-full px-4">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyVerificationPage;
