import React from "react";
import StatusBadge from "../UserManagement/StatusBadge";
import { CompanyResponse } from "../../types/company";

interface CompanyCardProps {
  company: CompanyResponse;
  onBlock: (company: CompanyResponse) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onBlock }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between space-x-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {company.companyName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {company.email}
            </p>
            <div className="mt-1 flex items-center space-x-2">
              <StatusBadge isBlocked={company.isBlocked} />
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={() => onBlock(company)}
            className={`inline-flex items-center justify-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white ${
              company.isBlocked
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } focus:outline-none transition-colors`}
          >
            {company.isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
