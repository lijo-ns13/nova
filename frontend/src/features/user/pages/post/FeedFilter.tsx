import React from "react";
import {
  Zap as TrendingIcon,
  Clock as RecentIcon,
  Image as MediaIcon,
} from "react-feather";

const FeedFilter = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-1">
          <button
            onClick={() => onFilterChange("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors ${
              activeFilter === "all"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <RecentIcon size={16} className="mr-1.5" />
            <span>Recent</span>
          </button>
          <button
            onClick={() => onFilterChange("trending")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors ${
              activeFilter === "trending"
                ? "bg-orange-100 text-orange-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <TrendingIcon size={16} className="mr-1.5" />
            <span>Trending</span>
          </button>
          <button
            onClick={() => onFilterChange("media")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center transition-colors ${
              activeFilter === "media"
                ? "bg-purple-100 text-purple-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <MediaIcon size={16} className="mr-1.5" />
            <span>Media</span>
          </button>
        </div>

        <div className="hidden sm:block">
          <select className="text-sm border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500">
            <option>Most relevant</option>
            <option>Most recent</option>
            <option>Most popular</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FeedFilter;
