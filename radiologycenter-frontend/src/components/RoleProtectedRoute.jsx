import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleProtectedRoute = ({ roles, children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="flex justify-center p-8"><span className="loading loading-spinner"></span></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  if (!user || !allowedRoles.includes(user.role)) {
    return <div className="flex flex-col items-center justify-center p-8"><div className="alert alert-error">Not authorized</div></div>;
  }

  return children;
};

export default RoleProtectedRoute; 