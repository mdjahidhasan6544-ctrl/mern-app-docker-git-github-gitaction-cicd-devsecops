import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const AdminRoute = ({ children }) => {
  const { userInfo } = useAuthStore();

  if (!userInfo) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  if (!userInfo.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;