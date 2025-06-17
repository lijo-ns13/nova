import React from "react";
import { Outlet } from "react-router-dom";
import SiteInfoNav from "../components/SiteInfoNav";
import SiteInfoFooter from "../components/SiteInfoFooter";

const SiteLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Top Navigation */}
      <SiteInfoNav />

      {/* Main Content */}
      <main className="flex-1 pt-20 px-4 flex items-center justify-center">
        <div className="w-full max-w-md text-center py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <SiteInfoFooter />
    </div>
  );
};

export default SiteLayout;
