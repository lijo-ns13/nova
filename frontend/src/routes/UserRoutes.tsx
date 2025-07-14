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

import ChatPage from "../features/user/pages/ChatPage";
import NetworkPage from "../features/user/pages/NetworkPage";
import ChatListPage from "../features/user/pages/ChatListPage";
import ProtectedMultiRole from "./ProtectedMultiRole";
import MainProfilePage from "../features/user/pages/MainProfilePage";
import InterviewUserPage from "../features/user/pages/InterviewUserpage";
import NotificationPage from "../features/user/pages/NotificationPage";
import SubscriptionUserPage from "../features/user/pages/SubscriptionUserPage";
import ProtectedWithoutChild from "./ProtectedWithoutChld";
import NotFoundPage from "../components/PageNotFound";
import PaymentSuccess from "../components/PaymentSuccess";
import PaymentFailure from "../components/PaymentFailure";
import RefundPage from "../features/user/pages/RefundPage";

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
        <Route path="jobs/:jobId" element={<JobDetailedPage />} />
        <Route path="message/:otherUserId" element={<ChatPage />} />

        <Route path="interview/:roomId" element={<InterviewUserPage />} />

        <Route path="notification" element={<NotificationPage />} />
      </Route>
      {/* Protected with no user layout *************************************/}
      <Route
        element={
          <ProtectedWithoutChild SpecificRole="user" redirectPath="/login" />
        }
      >
        <Route path="/subscription" element={<SubscriptionUserPage />} />
        <Route path="network" element={<NetworkPage />} />
        <Route path="message" element={<ChatListPage />} />
        <Route path="payment-success" element={<PaymentSuccess />} />
        <Route path="payment-failure" element={<PaymentFailure />} />
        <Route path="refund" element={<RefundPage />} />
      </Route>
      {/* Protected + no user layout+multiple role access ********************************/}
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
      <Route path="*" element={<NotFoundPage />} />
      {/* if same user hten his profile page if others username then there profile page just viewable not editable and also admin,company,users can view that rightnow i protexted with one orle */}
    </Routes>
  );
};
export default UserRoutes;
