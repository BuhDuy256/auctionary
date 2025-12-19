import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../constants/roles";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.status === "pending_verification") {
    if (location.pathname === "/verify-otp") {
      return <Outlet />;
    }
    return <Navigate to="/verify-otp" replace />;
  }

  if (user?.status === "active" && location.pathname === "/verify-otp") {
    return <Navigate to="/" replace />;
  }

  const hasPermission = user?.roles?.some((role) =>
    allowedRoles.includes(role)
  );

  if (hasPermission) {
    return <Outlet />;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
};

export default ProtectedRoute;
