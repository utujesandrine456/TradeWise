import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireVerified = false,
}) => {
  const { user, loading, checkAuth } = useAuth();

  useEffect(() => {
    if (loading) {
      // Ensure initial loader is hidden
      const initialLoader = document.getElementById('initial-loader');
      if (initialLoader) {
        initialLoader.style.display = 'none';
        if (window.cleanupInitialLoader) {
          window.cleanupInitialLoader();
        }
      }
    }
  }, [loading]);

  if (loading) {
    return null; // Resolve instantly without blocking fake UI
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }


  if (!requireAuth && user && !loading) {
    return <Navigate to={"/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
