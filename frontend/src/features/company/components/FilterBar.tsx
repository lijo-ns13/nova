import React, { useState } from "react";
import { Filter, ChevronDown } from "lucide-react";
import SearchBar from "../../admin/components/UserManagement/SearchBar";

interface FilterBarProps {
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onSortChange: (sort: string) => void;
  onDateChange: (dateFrom: string, dateTo: string) => void;
  searchValue: string;
  statusValue: string;
  sortValue: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  onSearchChange,
  onStatusChange,
  onSortChange,
  onDateChange,
  searchValue,
  statusValue,
  sortValue,
}) => {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleClearSearch = () => {
    onSearchChange("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleDateSubmit = () => {
    onDateChange(dateFrom, dateTo);
    setShowDateFilter(false);
  };

  const handleClearDates = () => {
    setDateFrom("");
    setDateTo("");
    onDateChange("", "");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchValue}
            onChange={handleSearchChange}
            onClear={handleClearSearch}
            placeholder="Search by applicant name or email..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg appearance-none bg-white"
                value={statusValue}
                onChange={(e) => onStatusChange(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="interview_cancelled">Interview Cancelled</option>
                <option value="interview_accepted_by_user">
                  Interview Accepted
                </option>
                <option value="interview_rejected_by_user">
                  Interview Rejected
                </option>
                <option value="interview_failed">Interview Failed</option>
                <option value="interview_passed">Interview Passed</option>
                <option value="offered">Offered</option>
                <option value="selected">Selected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg appearance-none bg-white"
                value={sortValue}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="flex items-center justify-between w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 bg-white"
            >
              <span className="flex items-center gap-2">
                <Filter size={16} />
                <span>
                  {dateFrom ? "Date filter applied" : "Filter by date"}
                </span>
              </span>
              <ChevronDown size={16} />
            </button>

            {showDateFilter && (
              <div className="absolute z-10 mt-1 w-64 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={handleClearDates}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleDateSubmit}
                      className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
