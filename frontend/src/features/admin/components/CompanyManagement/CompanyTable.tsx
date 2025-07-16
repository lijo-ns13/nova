import React from "react";
import { CompanyResponse } from "./CompanyManagement";
import StatusBadge from "../UserManagement/StatusBadge";

interface CompanyTableProps {
  companies: CompanyResponse[];
  onBlock: (company: CompanyResponse) => void;
}

const CompanyTable: React.FC<CompanyTableProps> = ({ companies, onBlock }) => {
  if (companies.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 text-center">
        <p className="text-gray-500 dark:text-gray-400">No companies found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Company
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {companies.map((company) => (
            <tr key={company.id}>
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                {company.companyName}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell text-gray-700 dark:text-gray-300">
                {company.email}
              </td>
              <td className="px-4 py-3">
                <StatusBadge isBlocked={company.isBlocked} />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onBlock(company)}
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-white ${
                    company.isBlocked
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
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
  );
};

export default CompanyTable;
