import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicOnlyRoute = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Đang tải...</div>; // Nên thay bằng LoadingSpinner
  }

  if (isAuthenticated) {
    if (user?.status === "pending_verification") {
      return <Navigate to="/verify-otp" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicOnlyRoute;
