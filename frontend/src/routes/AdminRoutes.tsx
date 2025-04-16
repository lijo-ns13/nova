import { Routes, Route } from "react-router-dom";
// auth pages
import SignIn from "../features/admin/pages/SignIn";

// protectedpages
import Dashboard from "../features/admin/pages/Dashboard";
import AdminLayout from "../layouts/AdminLayout";
import Protected from "./Protected";
import UserManagement from "../features/admin/pages/UserManagement";
import CompanyManagement from "../features/admin/pages/CompanyManagement";
import CompanyVerificationPage from "../features/admin/pages/CompanyVerification";

import SkillList from "../features/admin/pages/SkillList";
const AdminRoutes = () => {
  return (
    <Routes>
      {/* auth */}
      <Route path="/signin" element={<SignIn />} />

      <Route
        element={
          <Protected SpecificRole="admin" redirectPath="/admin/signin">
            <AdminLayout />
          </Protected>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/company-management" element={<CompanyManagement />} />
        <Route
          path="/company-verification"
          element={<CompanyVerificationPage />}
        />
        <Route path="/skill-management" element={<SkillList />}></Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
