import { Routes, Route } from "react-router-dom";
// auth pages
import SignIn from "../features/admin/pages/SignIn";

// protectedpages
import AdminLayout from "../layouts/AdminLayout";
import Protected from "./Protected";
// import UserManagement from "../features/admin/pages/UserManagement";
import UserManagement from "../features/admin/components/UserManagement/UserManagement";
// import CompanyManagement from "../features/admin/pages/CompanyManagement";
import CompanyMangement from "../features/admin/components/CompanyManagement/CompanyManagement";
import CompanyVerificationPage from "../features/admin/pages/CompanyVerification";
// import SubscriptionManagementPage from "../features/admin/pages/SubscriptionManagementPage";
// import SubscriptionManagement from "../features/admin/components/Subscription/SubscriptionManagement";
import SubFeatPage from "../features/admin/pages/SubFeatPage";
import SkillList from "../features/admin/pages/SkillList";
import NotFoundPage from "../components/PageNotFound";
import NotificationPage from "../features/user/pages/NotificationPage";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import SubHistory from "../features/admin/pages/SubHistory";
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
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/company-management" element={<CompanyMangement />} />
        <Route path="/subscription-management" element={<SubFeatPage />} />
        <Route path="/subscription-history" element={<SubHistory />} />
        <Route
          path="/company-verification"
          element={<CompanyVerificationPage />}
        />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/skill-management" element={<SkillList />}></Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AdminRoutes;
