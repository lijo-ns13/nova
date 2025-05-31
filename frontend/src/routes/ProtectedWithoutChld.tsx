import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { logout } from "../features/auth/auth.slice";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  SpecificRole: "user" | "company" | "admin";
  redirectPath: string;
}

const ProtectedWithoutChild = ({
  SpecificRole,
  redirectPath,
}: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, role, isVerified, isBlocked } = useAppSelector(
    (state) => state.auth
  );

  if (isBlocked) {
    toast.error("You are blocked.");
    dispatch(logout());
    return <Navigate to={redirectPath} replace />;
  }

  if (role === "company" && !isVerified) {
    toast.error("Company is not verified.");
    dispatch(logout());
    return <Navigate to="/locked-dashboard" replace />;
  }

  if (!isAuthenticated) {
    dispatch(logout());
    return <Navigate to={redirectPath} replace />;
  }

  if (role !== SpecificRole) {
    toast.error("You are trying to access an unauthorized role.");
    dispatch(logout());
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedWithoutChild;
