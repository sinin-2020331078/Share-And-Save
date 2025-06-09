import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // If loading, render nothing (or a loading indicator)
  if (loading) {
    return null; // Or return a loading spinner component
  }

  // If not loading, check authentication status
  // If authenticated, render the child routes/components
  // Otherwise, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 