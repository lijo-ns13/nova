import { Routes, Route } from "react-router-dom";

// auth pages
import SignIn from "../features/company/pages/SignIn";
import SignUp from "../features/company/pages/SignUp";
import ForgetPassword from "../features/company/pages/ForgetPassword";
import VerifyEmail from "../features/company/pages/VerifyEmail";

// protected pages
import Dashboard from "../features/company/pages/Dashboard";
import CompanyLayout from "../layouts/CompanyLayout";
import CreateJobPage from "../features/company/pages/CreateJobPage";
import Protected from "./Protected";
import ManageJobsPage from "../features/company/pages/ManageJobsPage";
import JobDetailedPage from "../features/company/pages/JobDetailedPage";
import JobApplicantsPage from "../features/company/pages/JobApplicantsPage";

const CompanyRoutes = () => {
  return (
    <Routes>
      {/* auth routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/forget-password" element={<ForgetPassword />} />

      <Route
        element={
          <Protected SpecificRole="company" redirectPath="/company/signin">
            <CompanyLayout />
          </Protected>
        }
      >
        {/* protected routes here */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<CreateJobPage />} />
        <Route path="/manage-jobs" element={<ManageJobsPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailedPage />} />
        <Route path="/job/applicants/:jobId" element={<JobApplicantsPage />} />
      </Route>
    </Routes>
  );
};
export default CompanyRoutes;
