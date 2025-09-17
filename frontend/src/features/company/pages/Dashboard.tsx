import React from "react";
import CompanyDashboard from "../components/CompanyDashboard";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* You can add your navigation header here */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Company Portal</h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <CompanyDashboard />
      </main>
    </div>
  );
};

export default Dashboard;
