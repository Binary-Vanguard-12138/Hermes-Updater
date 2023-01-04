import React from "react";
import { Navigate } from "react-router-dom";
import { UserRole } from "../constants";
import useAuth from "../hooks/useAuth";

function HomePage() {
  const { user } = useAuth();
  if (user) {
    if (UserRole.SUPER_ADMIN === user.role) {
      return <Navigate to="/admin/user" />;
    } else {
      return <Navigate to="/user/product" />;
    }
  } else {
    return <Navigate to="/auth/sign-in" />;
  }
}

export default HomePage;
