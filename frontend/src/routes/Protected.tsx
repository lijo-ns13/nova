import { Navigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { JSX } from "react";
import { logout } from "../features/auth/auth.slice";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: JSX.Element;
  SpecificRole: "user" | "company" | "admin";
  redirectPath: string;
}

const Protected = ({
  children,
  SpecificRole,
  redirectPath,
}: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();

  // Use useSelector to get the auth state from the Redux store
  const { isAuthenticated, role, isVerified, isBlocked } = useAppSelector(
    (state) => state.auth
  );
  if (isBlocked) {
    toast.success("user is blocked");
    dispatch(logout());
    return <Navigate to={redirectPath} />;
  }
  if (role == "company" && !isVerified) {
    toast.error("User is not verified");
    dispatch(logout());
    return <Navigate to={"/locked-dashboard"} />;
  }
  if (!isAuthenticated) {
    dispatch(logout());
    return <Navigate to={redirectPath} />;
  }
  // If the user's role does not match the required role, redirect to the specified path
  if (role !== SpecificRole) {
    toast.error("you trying to access other role");
    dispatch(logout());
    return <Navigate to={redirectPath} />;
  }

  // If the user is authenticated and has the correct role, render the children
  return children;
};

export default Protected;
