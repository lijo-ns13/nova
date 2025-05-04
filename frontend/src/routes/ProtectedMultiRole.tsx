import { Navigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { JSX } from "react";
import { logout } from "../features/auth/auth.slice";
import toast from "react-hot-toast";

interface ProtectedMultiRoleProps {
  children: JSX.Element;
  allowedRoles: Array<"user" | "company" | "admin">;
  redirectPath: string;
}

const ProtectedMultiRole = ({
  children,
  allowedRoles,
  redirectPath,
}: ProtectedMultiRoleProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, role, isVerified, isBlocked } = useAppSelector(
    (state) => state.auth
  );

  if (isBlocked) {
    toast.error("User is blocked");
    dispatch(logout());
    return <Navigate to={redirectPath} />;
  }

  if (role === "company" && !isVerified) {
    toast.error("Company is not verified");
    dispatch(logout());
    return <Navigate to="/locked-dashboard" />;
  }

  if (!isAuthenticated) {
    dispatch(logout());
    return <Navigate to={redirectPath} />;
  }

  if (!allowedRoles.includes(role as "user" | "company" | "admin")) {
    toast.error("Unauthorized access attempt");
    dispatch(logout());
    return <Navigate to={redirectPath} />;
  }

  return children;
};

export default ProtectedMultiRole;
