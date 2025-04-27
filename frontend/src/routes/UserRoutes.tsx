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
import ProfilePage from "../features/user/pages/ProfilePage";
import JobDetailedPage from "../features/user/pages/JobDetailedPage";
import AppliedJobsPage from "../features/user/pages/AppliedJobsPage";
import SavedJobsPage from "../features/user/pages/SavedJobsPage";
const UserRoutes = () => {
  // const { name } = useAppSelector((state) => state.auth);
  // name is Lijo N S like i want to lijo-n
  // const modifiedName = name.toLocaleLowerCase().replace(/ /g, "-");
  // console.log("modifiedName", modifiedName);
  // get user role  from store here this
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
      </Route>
      {/* Protected + no user layout */}
      <Route
        path="user-profile"
        element={
          <Protected SpecificRole="user" redirectPath="/login">
            <ProfilePage />
          </Protected>
        }
      ></Route>
    </Routes>
  );
};
export default UserRoutes;
