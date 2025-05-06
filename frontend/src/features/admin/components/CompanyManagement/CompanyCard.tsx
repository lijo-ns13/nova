import React from "react";
import { Company } from "../../types/types";
import StatusBadge from "../UserManagement/StatusBadge";
import UserAvatar from "../UserManagement/UserAvatar";

interface CompanyCardProps {
  company: Company;
  onBlock: (company: Company) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onBlock }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <UserAvatar
            name={company.companyName}
            imageSrc={company.profilePicture || company.documents?.[0]}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {company.companyName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {company.email}
          </p>
          <div className="mt-2 flex items-center space-x-2">
            <StatusBadge isBlocked={company.isBlocked} />
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                company.isVerified
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
              }`}
            >
              {company.isVerified ? "Verified" : "Pending"}
            </span>
          </div>
        </div>

        <div>
          <button
            onClick={() => onBlock(company)}
            className={`inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white ${
              company.isBlocked
                ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
          >
            {company.isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
