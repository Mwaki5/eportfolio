import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, accessToken, isAuthenticated } = useAuth();

  // If no access token or user, redirect to login
  if (!accessToken || !user || !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If roles are specified and user's role is not in allowed roles, redirect to their dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === "student") {
      return <Navigate to="/student/dashboard" replace />;
    } else if (user?.role === "staff") {
      return <Navigate to="/staff/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;

