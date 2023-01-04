import React from "react";

// All pages that rely on 3rd party components (other than MUI) are
// loaded asynchronously, to keep the initial JS bundle to a minimum size

// Layouts
import AuthLayout from "./layouts/Auth";
import UserLayout from "./layouts/User";
import AdminLayout from "./layouts/Admin";

// Guards
import AuthGuard from "./components/guards/AuthGuard";

// Contexts
import { UserProvider } from "./contexts/admin/UserContext";

// Auth components
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ResetPassword from "./pages/auth/ResetPassword";
import Page404 from "./pages/auth/Page404";
import Page500 from "./pages/auth/Page500";
import VerifyEmail from "./pages/auth/VerifyEmail";

// Home Page
import HomePage from "./pages/home";

// User Pages
import ProductPage from "./pages/user/product";
import PersonalProfile from "./pages/user/profile";

// Admin Pages
import Users from "./pages/admin/user";
import AdminAuthGuard from "./components/guards/AdminAuthGuard";

const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "verify-email/:token",
        element: <VerifyEmail />,
      },
      {
        path: "404",
        element: <Page404 />,
      },
      {
        path: "500",
        element: <Page500 />,
      },
    ],
  },
  {
    path: "admin",
    element: (
      <AdminAuthGuard>
        <AdminLayout />
      </AdminAuthGuard>
    ),
    children: [
      {
        path: "user",
        element: (
          <UserProvider>
            <Users />
          </UserProvider>
        ),
      },
      {
        path: "profile",
        element: <PersonalProfile />,
      },
    ],
  },
  {
    path: "user",
    element: (
      <AuthGuard>
        <UserLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "product",
        element: <ProductPage />,
      },
      {
        path: "profile",
        element: <PersonalProfile />,
      },
    ],
  },
  {
    path: "*",
    element: <AuthLayout />,
    children: [
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
];

export default routes;
