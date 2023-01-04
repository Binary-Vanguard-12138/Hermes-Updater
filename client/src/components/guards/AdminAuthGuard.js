import * as React from "react";
import { Navigate } from "react-router-dom";
import { UserRole } from "../../constants";

import useAuth from "../../hooks/useAuth";

// For routes that can only be accessed by authenticated users
function AdminAuthGuard({ children }) {
  const { isAuthenticated, isInitialized, user } = useAuth();

  if (isInitialized && !isAuthenticated) {
    return <Navigate to="/auth/sign-in" />;
  }

  if (!user || UserRole.SUPER_ADMIN < user.role) {
    return <Navigate to="/auth/sign-in" />;
  }

  return <React.Fragment>{children}</React.Fragment>;
}

export default AdminAuthGuard;
