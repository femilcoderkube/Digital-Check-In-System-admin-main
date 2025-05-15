import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Get the token from localStorage
  const authToken = localStorage.getItem("token");

  // Check if token exists
  const isAuthenticated = !!authToken; // Converts to true if token exists

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
