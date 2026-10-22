// ProtectedRoute.jsx
// Experiment 4c, 4d, 4e: Reusable ProtectedRoute restricting access and redirecting to Login

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "./Loading";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading fullPage message="Verifying patient authentication..." />;
  }

  if (!isAuthenticated) {
    // Experiment 4d: Redirect unauthenticated users to the Login page using Navigate
    // Save current location in state so user is redirected back after successful login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
