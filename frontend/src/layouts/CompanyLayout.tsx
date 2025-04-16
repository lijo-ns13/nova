import { Outlet } from "react-router-dom";
import Navbar from "../features/company/components/Navbar";
import Sidebar from "../features/company/components/Sidebar";

const CompanyLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;
