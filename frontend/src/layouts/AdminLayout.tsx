import { Outlet } from "react-router-dom";
import Navbar from "../features/admin/components/Navbar";
import Sidebar from "../features/admin/components/Sidebar";

function AdminLayout() {
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
}

export default AdminLayout;
