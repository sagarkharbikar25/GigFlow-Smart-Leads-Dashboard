import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

/**
 * 🔒 General Protected Route Guard
 * Blocks unauthenticated users from mounting interior dashboard pages
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Prevent routing redirects during initial session bootstrap
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            {/* Elegant pulse loader matching theme */}
            <div className="absolute inset-0 rounded-full border-t-2 border-brand-primary animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-b-2 border-brand-secondary animate-spin animate-reverse"></div>
          </div>
          <p className="text-brand-muted text-sm font-medium tracking-wide animate-pulse">
            Bootstrapping session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save current path to redirect user back after they log in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * 🛡️ Role-Based Route Guard
 * Restricts specific pages (like Admin settings or panels) to authorized roles
 */
export const RoleProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Let the general ProtectedRoute handle loading views
  }

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    // If not authorized, redirect to main Dashboard
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
