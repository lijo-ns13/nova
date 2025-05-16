import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";

// auth realted
import SignInPage from "../features/user/pages/SignInPage";
import SignUpPage from "../features/user/pages/SignUpPage";
import ForgetPasswordPage from "../features/user/pages/ForgetPasswordPage";
import ResetPasswordPage from "../features/user/pages/ResetPasswordPage";
import VerifyEmail from "../features/user/pages/VerifyEmail";
// protected pages
import FeedPage from "../features/user/pages/FeedPage";
import JobPage from "../features/user/pages/JobPage";
import Protected from "./Protected";
import OAuthSuccessPage from "../features/user/pages/OAuthSuccess";

import JobDetailedPage from "../features/user/pages/JobDetailedPage";
import AppliedJobsPage from "../features/user/pages/AppliedJobsPage";
import SavedJobsPage from "../features/user/pages/SavedJobsPage";
import ChatPage from "../features/user/pages/ChatPage";
import ProtectedMultiRole from "./ProtectedMultiRole";
import MainProfilePage from "../features/user/pages/MainProfilePage";
const UserRoutes = () => {
  return (
    <Routes>
      {/* user auth pages */}
      <Route path="login" element={<SignInPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="verify-otp" element={<VerifyEmail />} />
      <Route path="forget-password" element={<ForgetPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="/oauth-success" element={<OAuthSuccessPage />} />

      {/* Protected + user layout */}
      <Route
        element={
          <Protected SpecificRole="user" redirectPath="/login">
            <UserLayout />
          </Protected>
        }
      >
        {/* we can write other user routes like dahsboard,profeliall proetected */}
        <Route path="feed" element={<FeedPage />} />
        <Route path="jobs" element={<JobPage />} />
        <Route path="applied-jobs" element={<AppliedJobsPage />} />
        <Route path="saved-jobs" element={<SavedJobsPage />} />
        <Route path="jobs/:jobId" element={<JobDetailedPage />} />
        <Route path="message/:otherUserId" element={<ChatPage />} />
      </Route>
      {/* Protected + no user layout */}
      <Route
        path="/in/:username"
        element={
          <ProtectedMultiRole
            allowedRoles={["user", "admin", "company"]}
            redirectPath="/login"
          >
            <MainProfilePage />
          </ProtectedMultiRole>
        }
      ></Route>
      {/* if same user hten his profile page if others username then there profile page just viewable not editable and also admin,company,users can view that rightnow i protexted with one orle */}
    </Routes>
  );
};
export default UserRoutes;
