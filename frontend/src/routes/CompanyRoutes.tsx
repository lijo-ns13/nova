import { Routes, Route } from "react-router-dom";

// auth pages
import SignIn from "../features/company/pages/SignIn";
import SignUp from "../features/company/pages/SignUp";

import CompanyResetPassword from "../features/company/pages/CompanyResetPassword";
import VerifyEmail from "../features/company/pages/VerifyEmail";
import CompanyProfilePage from "../features/company/pages/CompanyProfilePage";
// protected pages
import Dashboard from "../features/company/pages/Dashboard";
import CompanyLayout from "../layouts/CompanyLayout";
import NotificationPage from "../features/user/pages/NotificationPage";
import Protected from "./Protected";
import ManageJobsPage from "../features/company/pages/ManageJobsPage";
import JobDetailedPage from "../features/company/pages/JobDetailedPage";
// import JobApplicantsPage from "../features/company/pages/JobApplicantsPage";
import CompanyApplicantsPage from "../features/company/pages/CompanyApplicantsPage";
import InterviewCompanyPage from "../features/company/pages/InterviewCompanyPage";
import ApplicationDetailPage from "../features/company/pages/ApplicantDetails";
import NotFoundPage from "../components/PageNotFound";
import ForgetPasswordPage from "../features/company/pages/ForgetPassword";
import ResetPasswordPage from "../features/company/pages/ResetPasswordPage";
import CompanyUpcomingInterviews from "../features/company/pages/CompanyUpcomingInterviews";
import ApplicantList from "../features/company/pages/ApplicantList";
const CompanyRoutes = () => {
  return (
    <Routes>
      {/* auth routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/forget-password" element={<ForgetPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        element={
          <Protected SpecificRole="company" redirectPath="/company/signin">
            <CompanyLayout />
          </Protected>
        }
      >
        {/* protected routes here */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/profile" element={<CompanyProfilePage />} /> */}
        <Route path="/manage-jobs" element={<ManageJobsPage />} />
        <Route path="/jobs/:jobId" element={<JobDetailedPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        {/* <Route
          path="/job/applicants/:jobId"
          element={<CompanyApplicantsPage />}
        /> */}
        <Route path="/job/applicants/:jobId" element={<ApplicantList />} />
        <Route path="/company-profile" element={<CompanyProfilePage />} />
        <Route path="/interview/:roomId" element={<InterviewCompanyPage />} />
        <Route path="/upcoming" element={<CompanyUpcomingInterviews />} />
        <Route
          path="/job/application/:applicationId"
          element={<ApplicationDetailPage />}
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
export default CompanyRoutes;
