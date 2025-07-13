import React from "react";
export interface FilterOptions {
  jobType: string[]; // checkbox group
  employmentType: string[]; // checkbox group
  experienceLevel: string[]; // checkbox group
  minSalary: string; // input type="number", stored as string
  maxSalary: string;
}
interface FilterPanelProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  fetchJobs: () => void;
  clearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  fetchJobs,
  clearFilters,
}) => {
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[
        filterType as keyof typeof filters
      ] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [filterType]: newValues,
      };
    });
  };

  const handleSalaryFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Job Type Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Job Type</h3>
          <div className="space-y-2">
            {["remote", "hybrid", "on-site"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={filters.jobType.includes(type)}
                  onChange={() => handleFilterChange("jobType", type)}
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {type.replace("-", " ")}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Employment Type Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Employment Type
          </h3>
          <div className="space-y-2">
            {["full-time", "part-time", "contract", "internship"].map(
              (type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={filters.employmentType.includes(type)}
                    onChange={() => handleFilterChange("employmentType", type)}
                  />
                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {type.replace("-", " ")}
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Experience Level Filter */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </h3>
          <div className="space-y-2">
            {["entry", "mid", "senior", "lead"].map((level) => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={filters.experienceLevel.includes(level)}
                  onChange={() => handleFilterChange("experienceLevel", level)}
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {level}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary Range Filter */}
        <div className="md:col-span-3">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Salary Range
          </h3>
          <form
            onSubmit={handleSalaryFilter}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">$</span>
              <input
                type="number"
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.minSalary}
                onChange={(e) =>
                  setFilters({ ...filters, minSalary: e.target.value })
                }
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">$</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={filters.maxSalary}
                onChange={(e) =>
                  setFilters({ ...filters, maxSalary: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Apply
            </button>
          </form>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
