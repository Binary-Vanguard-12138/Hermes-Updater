import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function HomePage() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/user/product" />;
  } else {
    return <Navigate to="/auth/sign-in" />;
  }
}

export default HomePage;
