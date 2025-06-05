import React, { useState } from "react";
import { Company } from "../../types/types";
import StatusBadge from "../UserManagement/StatusBadge";
import UserAvatar from "../UserManagement/UserAvatar";
import BaseModal from "../../../user/componets/modals/BaseModal";

interface CompanyTableProps {
  companies: Company[];
  onBlock: (company: Company) => void;
}

const CompanyTable: React.FC<CompanyTableProps> = ({ companies, onBlock }) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const handleViewMore = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setSelectedCompany(null);
    setIsDetailsModalOpen(false);
  };

  const handleViewImage = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setCurrentImage("");
    setIsImageModalOpen(false);
  };

  if (companies.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">No companies found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        {/* Table headers */}
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Company
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Industry
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Verification
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        {/* Table body */}
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {companies.map((company) => (
            <tr
              key={company._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserAvatar
                      name={company.companyName}
                      imageSrc={
                        company.profilePicture || company.documents?.[0]
                      }
                      size="sm"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {company.companyName}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {company.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {company.industryType || "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge isBlocked={company.isBlocked} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    company.isVerified
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  }`}
                >
                  {company.isVerified ? "Verified" : "Pending"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onBlock(company)}
                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white ${
                    company.isBlocked
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
                >
                  {company.isBlocked ? "Unblock" : "Block"}
                </button>
                <button
                  onClick={() => handleViewMore(company)}
                  className="ml-2 inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  View More
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Company Details Modal */}
      <BaseModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        title="Company Details"
        // size="md"
      >
        {selectedCompany && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-200">
            <div className="space-y-2">
              <p>
                <strong>Company Name:</strong> {selectedCompany.companyName}
              </p>
              <p>
                <strong>Email:</strong> {selectedCompany.email}
              </p>
              <p>
                <strong>Industry:</strong> {selectedCompany.industryType || "-"}
              </p>
              <p>
                <strong>Founded:</strong> {selectedCompany.foundedYear || "-"}
              </p>
              <p>
                <strong>Location:</strong> {selectedCompany.location || "-"}
              </p>
              <p>
                <strong>About:</strong> {selectedCompany.about || "-"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedCompany.isBlocked ? "Blocked" : "Active"}
              </p>
              <p>
                <strong>Verification:</strong>{" "}
                {selectedCompany.isVerified ? "Verified" : "Pending"}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
              {selectedCompany.profilePicture && (
                <div className="relative group">
                  <img
                    src={selectedCompany.profilePicture}
                    alt="Company Logo"
                    className="w-40 h-40 object-cover rounded-lg shadow-md cursor-pointer hover:scale-105 transition-transform"
                    // onClick={() => handleViewImage(selectedCompany.profilePicture)}
                  />
                  <span className="absolute bottom-1 right-1 text-[10px] bg-black bg-opacity-60 text-white px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to Zoom
                  </span>
                </div>
              )}
              <button
                onClick={() =>
                  selectedCompany.profilePicture &&
                  handleViewImage(selectedCompany.profilePicture)
                }
                className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                View Full Image
              </button>
            </div>
          </div>
        )}
      </BaseModal>

      {/* Image Zoom Modal */}
      <BaseModal
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        title=""
        // size="xl"
        // noPadding
      >
        <div className="relative w-full h-full flex items-center justify-center p-4">
          <img
            src={currentImage}
            alt="Zoomed Company Logo"
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
          <button
            onClick={handleCloseImageModal}
            className="absolute top-4 right-4 p-2 bg-gray-800 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </BaseModal>
    </div>
  );
};

export default CompanyTable;
