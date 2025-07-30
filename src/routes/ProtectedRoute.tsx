import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useAccount } from "../hooks/useAccount";

const ProtectedRoute = () => {
  const location = useLocation();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { account, isLoading: isAccountLoading } = useAccount();

  if (isAuthLoading || isAccountLoading) {
    return <div>Loading session...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (
    account &&
    !account.onboardingComplete &&
    location.pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
